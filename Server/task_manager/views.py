import calendar
import pytz
import time as t

from django.shortcuts import render
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import TaskHistory
from .serializers import TaskHistorySerializer

from user_account_api.models import CustomUser, Subject
from user_account_api.serializers import SubjectSerializer

from dateutil import parser
from datetime import datetime, timedelta, date

from .models import tab_count

from .services.start_task import send_start_task_notification
from .services.end_task import send_end_task_notification
from .services.over_task import send_over_task_notification
# Create your views here.

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def task_manager(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:

        try:
            current_task = request.data['task_name']
        except KeyError:
            return Response({
                'task_name': 'This field is required.'
            }, status=status.HTTP_404_NOT_FOUND)

        try:
            subject_id = request.data['subject_id']
        except KeyError:
            return Response({
                'subject_id': 'This field is required.'
            }, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'POST':
            if not user.is_working:
                user.task_start_time = timezone.now()
                user.is_working = True
                user.track_task = current_task
                user.track_subject_id = subject_id
                user.save()

                # Email
                parent = user.children.all()[0]
                start_date = timezone.now()
                
                timezone_country = start_date.astimezone(pytz.timezone('Asia/Manila'))
                format_date = timezone_country.strftime('%b %d, %Y %I:%M:%S %p')

                send_start_task_notification(
                    parent.email, 
                    parent.first_name, 
                    parent, 
                    format_date,
                    user,
                    current_task
                )

                subject = Subject.objects.get(id=subject_id)
                duration = str(subject.task_limit)

                return Response({
                    'status': 'Task Started',
                    'duration': duration,
                    'is_exceed': user.is_exceed
                }, status=status.HTTP_200_OK)

            else:
                return Response({
                    'status': 'Task in progress.'
                }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def stop_task(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            task_name = request.data['task_name']
        except KeyError as e:
            return Response({
                'task_name': 'This field is required.'
            }, status=status.HTTP_200_OK)

        try:
            task_remark = request.data['task_remark']
        except KeyError:
            return Response({
                'task_remark': 'This field is required.'
            }, status=status.HTTP_200_OK)

        if user.is_working:
            end_date = timezone.now()
            spent_time = end_date - user.task_start_time

            total = spent_time.total_seconds()

            hours = int(total // 3600)
            minutes = int((total % 3600) // 60)
            seconds = int(total % 60)

            modify_hour = str(hours)
            modify_minute = str(minutes)
            modify_second = str(seconds)
            
            if hours < 10:
                modify_hour = '0{}'.format(hours)

            if minutes < 10:
                modify_minute = '0{}'.format(minutes)

            if seconds < 10:
                modify_second = '0{}'.format(seconds)

            parse_spent_time = "{} : {} : {}".format(modify_hour, modify_minute, modify_second)

            track_subject_id = user.track_subject_id

            subject = Subject.objects.get(id=track_subject_id)
  
            save_history = TaskHistory.objects.create(
                user=user,
                subject=subject,
                task=task_name,
                start_date=user.task_start_time,
                end_date=end_date,
                time_spent=parse_spent_time,
                spent_in_second=total,
                remark=task_remark,
                change_tab_count=user.page_visible
            )

            exceed = int(total - subject.task_limit.total_seconds())
        
            if exceed > 0:
                time = t.strftime('%H:%M:%S', t.gmtime(exceed))
            else:
                time = t.strftime('%H:%M:%S', t.gmtime(0))

            # Email ==========================
            parent = user.children.all()[0]
            start_date = timezone.now()
            
            timezone_country = start_date.astimezone(pytz.timezone('Asia/Manila'))
            format_date = timezone_country.strftime('%b %d, %Y %I:%M:%S %p')

            end_date_country = end_date.astimezone(pytz.timezone('Asia/Manila'))
            end_format_date = end_date_country.strftime('%b %d, %Y %I:%M:%S %p')

            send_end_task_notification(
                parent.email,
                parent.first_name, 
                parent, 
                format_date,
                user,
                subject.subject,
                end_format_date,
                parse_spent_time,
                user.page_visible,
                str(time),
                str(subject.task_limit)
            )

            # ====================================

            user.is_working = False
            user.task_start_time = None
            user.track_task = None
            user.track_subject_id = -1
            user.page_visible = 0
            user.is_exceed = False
            user.save()

            today = datetime.today() - timedelta(days=1)
            today_task_hisotry = TaskHistory.objects.filter(user=user, start_date__gte=today).order_by('-start_date')
            today_serializer = TaskHistorySerializer(today_task_hisotry, many=True)

            week = datetime.today() - timedelta(days=7)
            week_task_history = TaskHistory.objects.filter(user=user, start_date__gte=week).order_by('-start_date')
            weeK_serializer = TaskHistorySerializer(week_task_history, many=True)

            subjects = Subject.objects.filter(student=user)
            serializer = SubjectSerializer(subjects, many=True)

            
            return Response({
                'status': 'Task Completed',
                'today_history': today_serializer.data,
                'week_history': weeK_serializer.data,
                'subjects': serializer.data
            }, status=status.HTTP_200_OK)

        else:
            return Response({
                'status': 'Task not started.'
            }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_time(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:

        # if user.is_parent:
        #     serializers = list()
        #     students = list()

        #     for student in user.children.all():
        #         if student.is_approve_student:
        #             student_user = CustomUser.objects.get(id=student.id)
        #             name = student_user.last_name.title() + ', ' + student_user.first_name.title()
        #             task_history = TaskHistory.objects.filter(user=student_user, is_done_approve=False)
        #             serializer = TaskHistorySerializer(task_history, many=True)
        #             serializers.append(serializer.data) 
        #             students.append(name)
                    
        #     return Response({
        #         'is_parent': user.is_parent,
        #         'serializers': serializers,
        #         'student_name': students
        #     }, status=status.HTTP_200_OK)                     

        if user.is_working:
            start_time = user.task_start_time
            subject_id = user.track_subject_id

            subject = Subject.objects.get(id=subject_id)
            duration = str(subject.task_limit)

            return Response({
                'start_time': start_time,
                'is_working': user.is_working,
                'current_task': user.track_task,
                'is_parent': user.is_parent,
                'duration': duration,
                'is_exceed': user.is_exceed
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': 'Task not yet started.',
                'is_working': user.is_working,
                'is_parent': user.is_parent,
            }, status=status.HTTP_200_OK)    

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_task(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        today = datetime.today() - timedelta(days=1)
        today_task_hisotry = TaskHistory.objects.filter(user=user, start_date__gte=today).order_by('-start_date')
        today_serializer = TaskHistorySerializer(today_task_hisotry, many=True)
        
        week = datetime.today() - timedelta(days=7)
        week_task_history = TaskHistory.objects.filter(user=user, start_date__gte=week).order_by('-start_date')
        weeK_serializer = TaskHistorySerializer(week_task_history, many=True)

        all_history = TaskHistory.objects.filter(user=user).exclude(start_date__gte=week).order_by('-start_date')
        all_serializer = TaskHistorySerializer(all_history, many=True)

        return Response({
            'today_history': today_serializer.data, 
            'week_history': weeK_serializer.data,
            'all_history': all_serializer.data
        }, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_task(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        delete_id = request.data['task_id']

        task_history = TaskHistory.objects.get(id=delete_id).delete()

        today = datetime.today() - timedelta(days=1)
        today_task_hisotry = TaskHistory.objects.filter(user=user, start_date__gte=today).order_by('-start_date')
        today_serializer = TaskHistorySerializer(today_task_hisotry, many=True)

        week = datetime.today() - timedelta(days=7)
        week_task_history = TaskHistory.objects.filter(user=user, start_date__gte=week).order_by('-start_date')
        weeK_serializer = TaskHistorySerializer(week_task_history, many=True)

        all_history = TaskHistory.objects.all().exclude(start_date__gte=week).order_by('-start_date')
        all_serializer = TaskHistorySerializer(all_history, many=True)

        return Response({
            'today_history': today_serializer.data,
            'week_history': weeK_serializer.data,
            'all_history': all_serializer.data
        }, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def history(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            month_day = int(request.data['month'])
        except KeyError:
            month = datetime.today().month
        except TypeError:
            month = datetime.today().month
        else:
            month = month_day

        month_name = calendar.month_name[month]

        subjects = Subject.objects.filter(student=user)
        subject_serializer = SubjectSerializer(subjects, many=True)

        today = datetime.today() - timedelta(days=1)
        today_task_hisotry = TaskHistory.objects.filter(user=user, start_date__gte=today).order_by('-start_date')
        today_serializer = TaskHistorySerializer(today_task_hisotry, many=True)

        week = datetime.today() - timedelta(days=7)
        week_task_history = TaskHistory.objects.filter(user=user, start_date__gte=week).order_by('-start_date')
        weeK_serializer = TaskHistorySerializer(week_task_history, many=True)

        all_history = TaskHistory.objects.filter(user=user).exclude(start_date__gte=week).order_by('-start_date')
        all_serializer = TaskHistorySerializer(all_history, many=True)

        year = datetime.today().year

        current_calendar = calendar.monthcalendar(year, month)

        monthly_calendary = list()

        for count, week in enumerate(current_calendar):
            days = [day for day in week if day != 0]

            start_date = date(year, month, days[0])
            end_date = date(year, month, days[-1]) + timedelta(days=1)

            weeks = list()
            for subject in subjects:
                task_history = TaskHistory.objects.filter(
                    user=user,
                    subject=subject,
                    is_parent_approve=True,
                    is_done_approve=True,
                    start_date__range=[start_date, end_date]
                )

                total_second = 0
                for task in task_history:
                    total_second += task.spent_in_second

                weeks.append(total_second)
            monthly_calendary.append(weeks)

        return Response({
            'today_history': today_serializer.data,
            'week_history': weeK_serializer.data,
            'all_history': all_serializer.data,
            'subjects': subject_serializer.data,
            'monthly_calendar': monthly_calendary,
            'month_name': month_name
        }, status=status.HTTP_200_OK)

def date_handler(date):
    parse_date = parser.parse(date)

    modify_timezone = parse_date.replace(tzinfo=pytz.UTC)
    timezone_country = modify_timezone.astimezone(pytz.timezone("Asia/Manila"))

    format_date = modify_timezone.strftime('%Y-%m-%d')
    return format_date

def equal_date(date):
    parse_date = parser.parse(date)
    modify_timezone = parse_date.replace(tzinfo=pytz.UTC)
    timezone_country = modify_timezone.astimezone(pytz.timezone("Asia/Manila"))

    year = modify_timezone.strftime('%Y')
    month = modify_timezone.strftime('%m')
    day = modify_timezone.strftime('%d')

    return {
        'year': int(year),
        'month': int(month),
        'day': int(day)
    }

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def filter_history(request):
    email = request.user.username

    start_date_req = date_handler(request.data['start_date'])
    end_date_req = date_handler(request.data['end_date'])

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            month_day = request.data['month']
        except KeyError:
            month = datetime.today().month
        else:
            month = month_day

        month_name = calendar.month_name[month]

        subjects = Subject.objects.filter(student=user)
        subject_serializer = SubjectSerializer(subjects, many=True)

        today = datetime.today() - timedelta(days=1)
        today_task_hisotry = TaskHistory.objects.filter(user=user, start_date__gte=today).order_by('-start_date')
        today_serializer = TaskHistorySerializer(today_task_hisotry, many=True)

        week = datetime.today() - timedelta(days=7)
        week_task_history = TaskHistory.objects.filter(user=user, start_date__gte=week).order_by('-start_date')
        weeK_serializer = TaskHistorySerializer(week_task_history, many=True)

        if start_date_req == end_date_req:
            date_req = equal_date(end_date_req) 

            all_history = TaskHistory.objects.filter(
                user=user,
                start_date__year=date_req['year'], 
                start_date__month=date_req['month'], 
                start_date__day=date_req['day'],
            ).exclude(start_date__gte=week).order_by('-start_date')
            all_serializer = TaskHistorySerializer(all_history, many=True)

        else:
            all_history = TaskHistory.objects.filter(
                user=user,
                start_date__range=[start_date_req, end_date_req]
            ).exclude(start_date__gte=week).order_by('-start_date')

            all_serializer = TaskHistorySerializer(all_history, many=True)

        year = datetime.today().year

        current_calendar = calendar.monthcalendar(year, month)

        monthly_calendary = list()

        for count, week in enumerate(current_calendar):
            days = [day for day in week if day != 0]

            start_date = date(year, month, days[0])
            end_date = date(year, month, days[-1]) + timedelta(days=1)

            weeks = list()
            for subject in subjects:
                task_history = TaskHistory.objects.filter(
                    user=user,
                    subject=subject,
                    is_parent_approve=True,
                    is_done_approve=True,
                    start_date__range=[start_date, end_date]
                )

                total_second = 0
                for task in task_history:
                    total_second += task.spent_in_second

                weeks.append(total_second)
            monthly_calendary.append(weeks)

        return Response({
            'today_history': today_serializer.data,
            'week_history': weeK_serializer.data,
            'all_history': all_serializer.data,
            'subjects': subject_serializer.data,
            'monthly_calendar': monthly_calendary,
            'month_name': month_name
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def dashboard(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)

    subjects = Subject.objects.filter(student=user)
    serializer = SubjectSerializer(subjects, many=True)

    data = list()

    if user.is_staff:
        for subject in subjects:
            today = datetime.today() - timedelta(days=1)
            today_task_history = TaskHistory.objects.filter(
                user=user, 
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
                user=user, 
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
        'data': data,
        'serializer': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def parent_check(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            parent = user.parent.last_name.title() + ', ' + user.parent.first_name.title()
        except AttributeError:
            parent = ''
        
        return Response({
            'is_request': user.is_request,
            'is_approve_student': user.is_approve_student,
            'parent': parent
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def accept_parent(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        user.is_approve_student = True
        user.save()

        return Response({
            'is_approve_student': user.is_approve_student,
            'parent': user.parent.last_name.title() + ', ' + user.parent.first_name.title()
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def decline_parent(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        user.is_approve_student = False
        user.save()

        return Response({
            'is_approve_student': user.is_approve_student,
            'parent': user.parent.last_name.title() + ', ' + user.parent.first_name.title()
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def check_visibility(request):
    username = request.user

    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'BAD'
        }, status=status.HTTP_400_BAD_REQUEST)
    else: 
        if not user.is_working:
            return Response({
                'status': 'No current task.',
                'is_working': user.is_working,
                'alt_tab': user.page_visible,
                'current_task': user.track_task
            }, status=status.HTTP_200_OK)

        if user.is_working:
            user.page_visible += tab_count
            user.save()

            return Response({
                'status': 'OK',
                'is_working': user.is_working,
                'alt_tab': user.page_visible,
                'current_task': user.track_task
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': 'No current task.',
                'is_working': user.is_working,
                'alt_tab': user.page_visible,
                'current_task': user.track_task
            }, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def parent_history(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            month_day = int(request.data['month'])
        except KeyError:
            month = datetime.today().month
        except TypeError:
            month = datetime.today().month
        else:
            month = month_day

        student = user.children.all()[0]

        month_name = calendar.month_name[month]

        subjects = Subject.objects.filter(student=student)
        subject_serializer = SubjectSerializer(subjects, many=True)

        today = datetime.today() - timedelta(days=1)
        today_task_hisotry = TaskHistory.objects.filter(user=student, start_date__gte=today).order_by('-start_date')
        today_serializer = TaskHistorySerializer(today_task_hisotry, many=True)

        week = datetime.today() - timedelta(days=7)
        week_task_history = TaskHistory.objects.filter(user=student, start_date__gte=week).order_by('-start_date')
        weeK_serializer = TaskHistorySerializer(week_task_history, many=True)

        all_history = TaskHistory.objects.filter(user=student).exclude(start_date__gte=week).order_by('-start_date')
        all_serializer = TaskHistorySerializer(all_history, many=True)

        year = datetime.today().year

        current_calendar = calendar.monthcalendar(year, month)

        monthly_calendary = list()

        for count, week in enumerate(current_calendar):
            days = [day for day in week if day != 0]

            start_date = date(year, month, days[0])
            end_date = date(year, month, days[-1]) + timedelta(days=1)

            weeks = list()
            for subject in subjects:
                task_history = TaskHistory.objects.filter(
                    user=student,
                    subject=subject,
                    is_parent_approve=True,
                    is_done_approve=True,
                    start_date__range=[start_date, end_date]
                )

                total_second = 0
                for task in task_history:
                    total_second += task.spent_in_second

                weeks.append(total_second)
            monthly_calendary.append(weeks)

        return Response({
            'today_history': today_serializer.data,
            'week_history': weeK_serializer.data,
            'all_history': all_serializer.data,
            'subjects': subject_serializer.data,
            'monthly_calendar': monthly_calendary,
            'month_name': month_name
        }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def parent_filter_history(request):
    email = request.user.username

    start_date_req = date_handler(request.data['start_date'])
    end_date_req = date_handler(request.data['end_date'])

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)
    else:
        try:
            month_day = request.data['month']
        except KeyError:
            month = datetime.today().month
        else:
            month = month_day
        
        student = user.children.all()[0]

        month_name = calendar.month_name[month]

        subjects = Subject.objects.filter(student=student)
        subject_serializer = SubjectSerializer(subjects, many=True)

        today = datetime.today() - timedelta(days=1)
        today_task_hisotry = TaskHistory.objects.filter(user=student, start_date__gte=today).order_by('-start_date')
        today_serializer = TaskHistorySerializer(today_task_hisotry, many=True)

        week = datetime.today() - timedelta(days=7)
        week_task_history = TaskHistory.objects.filter(user=student, start_date__gte=week).order_by('-start_date')
        weeK_serializer = TaskHistorySerializer(week_task_history, many=True)

        if start_date_req == end_date_req:
            date_req = equal_date(end_date_req) 

            all_history = TaskHistory.objects.filter(
                user=student,
                start_date__year=date_req['year'], 
                start_date__month=date_req['month'], 
                start_date__day=date_req['day'],
            ).exclude(start_date__gte=week).order_by('-start_date')
            all_serializer = TaskHistorySerializer(all_history, many=True)

        else:
            all_history = TaskHistory.objects.filter(
                user=student,
                start_date__range=[start_date_req, end_date_req]
            ).exclude(start_date__gte=week).order_by('-start_date')

            all_serializer = TaskHistorySerializer(all_history, many=True)

        year = datetime.today().year

        current_calendar = calendar.monthcalendar(year, month)

        monthly_calendary = list()

        for count, week in enumerate(current_calendar):
            days = [day for day in week if day != 0]

            start_date = date(year, month, days[0])
            end_date = date(year, month, days[-1]) + timedelta(days=1)

            weeks = list()
            for subject in subjects:
                task_history = TaskHistory.objects.filter(
                    user=student,
                    subject=subject,
                    is_parent_approve=True,
                    is_done_approve=True,
                    start_date__range=[start_date, end_date]
                )

                total_second = 0
                for task in task_history:
                    total_second += task.spent_in_second

                weeks.append(total_second)
            monthly_calendary.append(weeks)

        return Response({
            'today_history': today_serializer.data,
            'week_history': weeK_serializer.data,
            'all_history': all_serializer.data,
            'subjects': subject_serializer.data,
            'monthly_calendar': monthly_calendary,
            'month_name': month_name
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def parent_dashboard(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)

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
        'data': data,
        'serializer': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def notify_exceed(request):
    email = request.user.username

    try:
        user = CustomUser.objects.get(username=email)
    except CustomUser.DoesNotExist:
        return Response({
            'status': 'User not found.'
        }, status=status.HTTP_400_BAD_REQUEST)

    parent = user.children.all()[0]
    subject = Subject.objects.get(id=user.track_subject_id)    

    if not user.is_exceed:
        send_over_task_notification(
            parent.email, 
            parent.first_name, 
            parent, 
            user,
            subject.subject
        )

    user.is_exceed = True
    user.save()

    return Response({
        'is_exceed': user.is_exceed
    }, status=status.HTTP_200_OK)

