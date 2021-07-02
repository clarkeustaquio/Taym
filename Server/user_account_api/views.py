# Rest Framework
from rest_framework.decorators import api_view, permission_classes, authentication_classes, throttle_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

# Models and Serializer
from .models import CustomUser
from .serializers import UserSerializer, PreviousPasswordSerializer

# from employees.models import Employee
# from employees.serializers import EmployeeSerializer

# Validator
from django.core.exceptions import ValidationError

# Settings
from django.conf import settings
from django.utils import timezone

# Token
from .tokens import account_activation_token
from django.contrib.auth.tokens import PasswordResetTokenGenerator

# For email 
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

# Custom Validators
from .validators.registration import ValidateRegistration, ValidateEmail
from .validators.new_password import ValidateNewPassword
from .validators.my_account_email import MyAccountChangeEmail

# Services
from user_account_api.services.account_activation import account_activation
from user_account_api.services.parent_activation import parent_activation
from user_account_api.services.reset_password import send_reset_password

from django.contrib.auth.checks import check_user_model


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def authorize_token(request):
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.get(user=request.user).delete()
    return Response({'status': 'OK'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def api_create_account(request):
    # Lagay ng authentication classes and permission para sa admin
    if request.method == 'POST':
        # email = request.data['email']
        username = request.data['username']
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        middle_name = request.data['middle_name']
        password = request.data['password']
        confirm_password = request.data['confirm_password']
        student_no = request.data['student_no']

        validated_registration = ValidateRegistration(
            # email, username, first_name, 
            username, first_name,
            last_name, middle_name, password, confirm_password,
        )

        if validated_registration:
            return Response(validated_registration, status=status.HTTP_200_OK)

        elif not validated_registration:
            user = CustomUser(
                first_name=first_name,
                last_name=last_name,
                username=username,
                # email=email,
                student_no=student_no
            )

            try:
                user.validate_unique()

            except ValidationError as e:
                validators = {
                    'isExist': 'User with this username already exists.'
                }
                return Response(validators, status=status.HTTP_200_OK)

            else:
                user.set_password(request.data['password'])

                try:
                    user.full_clean()
                except ValidationError as e:
                    return Response({'status': 'BAD'},status=status.HTTP_200_OK)
                else:
                    user.is_active = True
                    user.is_parent = False
                    user.save()
                    Token.objects.create(user=user)
                    # isActivate = account_activation(
                    #     email_to=email,
                    #     name=first_name,
                    #     user_pk=user.pk,
                    #     user=user
                    # )

                    return Response({'status': 'OK'}, status=status.HTTP_201_CREATED)

                    # if isActivate:
                    #     return Response({'status': 'OK'}, status=status.HTTP_201_CREATED)
                    # else:
                    #     return Response({'status': 'BAD'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_parent_account(request):
    if request.method == 'POST':
        # email = request.data['email']
        username = request.data['username']
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        middle_name = request.data['middle_name']
        password = request.data['password']
        confirm_password = request.data['confirm_password']
        student_email = request.data['student_email']

        validated_registration = ValidateRegistration(
            # email, username, first_name, 
            username, first_name, 
            last_name, middle_name, password, confirm_password,
        )

        if username == student_email:
            validated_registration['same_email'] = 'Username should not be the same with student username.'
        else:
            try:
                student = CustomUser.objects.get(username=student_email)    
            except CustomUser.DoesNotExist:
                validated_registration['student_not_exist'] = 'Student with this username does not exist.'

        if validated_registration:
            return Response(validated_registration, status=status.HTTP_200_OK)

        elif not validated_registration:
            user = CustomUser(
                first_name=first_name,
                last_name=last_name,
                username=username,
                email=username,
            )
            
            try:
                user.validate_unique()
                
            except ValidationError as e:
                validators = {
                    'isExist': 'User with this username already exists.'
                }
                return Response(validators, status=status.HTTP_200_OK)

            else:
                user.set_password(request.data['password'])

                try:
                    user.full_clean()
                except ValidationError as e:
                    return Response({'status': 'BAD'},status=status.HTTP_200_OK)
                else:
                    user.is_active = True
                    user.is_parent = True
                    user.save()
                    
                    user.children.add(student)

                    student = CustomUser.objects.get(id=student.id)
                    student.is_request = True
                    student.parent = user
                    student.save()

                    Token.objects.create(user=user)
                    
                    # isActivate = account_activation(
                    #     email_to=email,
                    #     name=first_name,
                    #     user_pk=user.pk,
                    #     user=user
                    # )

                    # isChild = parent_activation(
                    #     email_to=student_email,
                    #     name=student.first_name,
                    #     parent=last_name + ', ' + first_name,
                    #     user_pk=student.id,
                    #     user=student
                    # )
                    return Response({'status': 'OK'}, status=status.HTTP_201_CREATED)

                    # if isActivate and isChild:
                    #     return Response({'status': 'OK'}, status=status.HTTP_201_CREATED)
                    # else:
                    #     return Response({'status': 'BAD'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def validate_reset_password(request):

    # DITO
    if request.method == 'POST':
        try:
            email = force_text(urlsafe_base64_decode(request.data['email']))
            user = CustomUser.objects.get(email=email)
        except ValueError as e:
            return Response({'status': 'NOT_FOUND'}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist as e:
            return Response({'status': 'NOT_FOUND'}, status=status.HTTP_200_OK)
        
        else:
            first_name = user.first_name
            last_name = user.last_name
            new_password = request.data['new_password']
            confirm_password = request.data['confirm_password']

            validated_password = ValidateNewPassword(
                email, first_name, last_name, new_password, confirm_password)

            if not validated_password:
                serializer = PreviousPasswordSerializer(data={
                    'user': user.pk,
                    'old_password': user.password,
                    'date_change': timezone.now()
                })
                if serializer.is_valid():
                    user.set_password(new_password)
                    user.password_expiration = 30
                    user.save()
                    serializer.save()
                    return Response({'status': 'OK'}, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_200_OK)

            else:
                return Response(validated_password, status=status.HTTP_200_OK)

@api_view(['POST'])
def validate_email_exist(request):
    if request.method == 'POST':
        try:
            email = force_text(urlsafe_base64_decode(request.data['email']))
            user = CustomUser.objects.get(email=email)

            if user is not None and account_activation_token.check_token(user, request.data['token']):
                return Response({'status': 'OK'}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'BAD'}, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'status':'NOT_FOUND'}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist as e:
            return Response({'status':'NOT_FOUND'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def activate_account(request):
    if request.method == 'POST':
        try:
            uid = force_text(urlsafe_base64_decode(request.data['uid']))
        except ValueError as e:
            return Response({'auth': 'INVALID'},status=status.HTTP_200_OK)

        else:
            try:
                user = CustomUser.objects.get(pk=uid)
            
            except ValueError as e:
                return Response({'auth': 'INVALID'},status=status.HTTP_200_OK)
            else:
                if user is not None and account_activation_token.check_token(user, request.data['token']):
                    user.is_active = True
                    user.save()
                    return Response({'auth': 'VERIFIED'}, status=status.HTTP_200_OK)
                else:
                    return Response({'auth': 'INVALID'},status=status.HTTP_200_OK)

@api_view(['POST'])
def activate_child(request):
    if request.method == 'POST':
        try:
            uid = force_text(urlsafe_base64_decode(request.data['uid']))
        except ValueError as e:
            return Response({'auth': 'INVALID'},status=status.HTTP_200_OK)

        else:
            try:
                user = CustomUser.objects.get(pk=uid)
            
            except ValueError as e:
                return Response({'auth': 'INVALID'},status=status.HTTP_200_OK)
            else:
                if user is not None and account_activation_token.check_token(user, request.data['token']):
                    user.is_approve_student = True
                    user.save()
                    return Response({'auth': 'VERIFIED'}, status=status.HTTP_200_OK)
                else:
                    return Response({'auth': 'INVALID'},status=status.HTTP_200_OK)


@api_view(['POST'])
def reset_password(request):
    if request.method == 'POST':
        try:
            email = request.data['email']
            user = CustomUser.objects.get(email=email)

        except CustomUser.DoesNotExist as e:
            return Response({'status': 'NOT_FOUND',
            'message': 'Provided email address is not valid.'}, status=status.HTTP_200_OK)

        else:
            isSuccess = send_reset_password(
                email_to=email,
                name=user.first_name,
                user=user
            )

            return Response({'status': 'OK'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_email(request):
    if request.method == 'POST':
        try:
            user = CustomUser.objects.get(email=request.user)
        except CustomUser.DoesNotExist as e:
            return Response({'status': 'NOT_FOUND'}, status=status.HTTP_200_OK)
        else:
            validated_email = MyAccountChangeEmail(request.data['email'])

            if validated_email:
                return Response(validated_email, status=status.HTTP_200_OK)
            else:
                user.email = request.data['email']
                user.username = request.data['email']
                # user.is_active = False
                user.save()
                return Response({'status': 'OK'}, status=status.HTTP_200_OK)
