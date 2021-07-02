import datetime as dt
from datetime import timedelta, datetime
from django.shortcuts import render
from user_account_api.models import Subject, CustomUser
from user_account_api.serializers import SubjectSerializer

from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from task_manager.models import TaskHistory
from task_manager.serializers import TaskHistorySerializer

# Create your views here.

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def limit_subject(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)

    subjects = Subject.objects.filter(student=user, is_set_limit=True)
    serializer = SubjectSerializer(subjects, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST', 'GET', 'PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def subject(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'POST':
        try:
            subject_name = request.data['subject']
        except KeyError:
            return Response({
                'subject': 'This field is required.'
            }, status=status.HTTP_404_NOT_FOUND)

        # serializer = SubjectSerializer(data=request.data)
        duration = dt.timedelta(days=0, hours=0, minutes=0, seconds=0)

        subject = Subject.objects.create(
            student=user,
            subject=subject_name,
            task_limit=duration
        )

        subjects = Subject.objects.filter(student=user)
        serializer = SubjectSerializer(subjects, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'GET':
        subjects = Subject.objects.filter(student=user)
        serializer = SubjectSerializer(subjects, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        try:
            subject_name = request.data['subject_name']
        except KeyError:
            return Response({
                'subject_name': 'This field is required.'
            })

        try:
            subject_id = request.data['subject_id']
        except KeyError:
            return Response({
                'subject_id': 'This field is required.'
            })

        subject = Subject.objects.filter(id=subject_id).update(subject=subject_name)

        subjects = Subject.objects.filter(student=user)
        serializer = SubjectSerializer(subjects, many=True)

        task_history = TaskHistory.objects.filter(user=user, subject=subject_id).update(task=subject_name)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        try:
            subject_name = request.data['subject_name']
        except KeyError:
            return Response({
                'subject_name': 'This field is required.'
            })

        try:
            subject_id = request.data['subject_id']
        except KeyError:
            return Response({
                'subject_id': 'This field is required.'
            })

        subject = Subject.objects.get(id=subject_id).delete()
        subjects = Subject.objects.filter(student=user)
        serializer = SubjectSerializer(subjects, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_child_task(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)

    if user.is_parent:
        serializers = list()
        students = list()
        
        for student in user.children.all():
            if student.is_approve_student:
                student_user = CustomUser.objects.get(id=student.id)
                name = student_user.last_name.title() + ', ' + student_user.first_name.title()
                task_history = TaskHistory.objects.filter(user=student_user, is_done_approve=False)
                serializer = TaskHistorySerializer(task_history, many=True)
                serializers.append(serializer.data) 
                students.append(name)
                
        return Response({
            'is_parent': user.is_parent,
            'serializers': serializers,
            'student_name': students
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def approve_task(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        subject_id = request.data['subject_id']
    except KeyError:
        return Response({
            'subject_id': 'This field is required.'
        })

    task_history = TaskHistory.objects.filter(id=subject_id).update(
        is_done_approve=True, is_parent_approve=True)

    serializers = list()
    for student in user.children.all():
        if student.is_approve_student:
            student_user = CustomUser.objects.get(id=student.id)
            task_history = TaskHistory.objects.filter(user=student_user, is_done_approve=False)
            serializer = TaskHistorySerializer(task_history, many=True)
            serializers.append(serializer.data) 

    student = user.children.all()[0]

    subjects = Subject.objects.filter(student=student)
    serializer = SubjectSerializer(subjects, many=True)

    data = list()

    if student.is_staff:
        for subject in subjects:
            today = datetime.today() - timedelta(days=1)
            today_task_history = TaskHistory.objects.filter(
                user=student, 
                subject=subject, 
                start_date__gte=today).order_by('-start_date')
            today_serializer = TaskHistorySerializer(today_task_history, many=True)

            total_second = 0
            for task in today_task_history:
                total_second += task.spent_in_second
            
            data.append(total_second)
    else:
        for subject in subjects:
            today = datetime.today() - timedelta(days=1)
            today_task_history = TaskHistory.objects.filter(
                user=student, 
                subject=subject, 
                is_parent_approve=True,
                is_done_approve=True,
                start_date__gte=today).order_by('-start_date')
            today_serializer = TaskHistorySerializer(today_task_history, many=True)

            total_second = 0
            for task in today_task_history:
                total_second += task.spent_in_second
            
            data.append(total_second)

    return Response({
        'serializers': serializers,
        'data': data,
        'serializer': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def disapprove_task(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        subject_id = request.data['subject_id']
    except KeyError:
        return Response({
            'subject_id': 'This field is required.'
        })

    task_history = TaskHistory.objects.filter(id=subject_id).update(
        is_done_approve=True, is_parent_approve=False)

    serializers = list()
    for student in user.children.all():
        if student.is_approve_student:
            student_user = CustomUser.objects.get(id=student.id)
            task_history = TaskHistory.objects.filter(user=student_user, is_done_approve=False)
            serializer = TaskHistorySerializer(task_history, many=True)
            serializers.append(serializer.data) 

    return Response({
        'serializers': serializers
    }, status=status.HTTP_200_OK)

# Parent
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_student_subject(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)

    student = user.children.all()[0]
    subjects = Subject.objects.filter(student=student.id)
    serializer = SubjectSerializer(subjects, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edit_duration(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        subject_id = request.data['subject_id']
    except KeyError:
        return Response({
            'status': 'This field is required.'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        hour = int(request.data['hour'])
    except KeyError:
        return Response({
            'status': 'This field is required.'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        minute = int(request.data['minute'])
    except KeyError:
        return Response({
            'status': 'This field is required.'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        second = int(request.data['second'])
    except KeyError:
        return Response({
            'status': 'This field is required.'
        }, status=status.HTTP_400_BAD_REQUEST)

    student = user.children.all()[0].id
    duration = dt.timedelta(days=0, hours=hour, minutes=minute, seconds=second)
    Subject.objects.filter(id=subject_id).update(task_limit=duration, is_set_limit=True)

    subjects = Subject.objects.filter(student=student)
    serializer = SubjectSerializer(subjects, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)