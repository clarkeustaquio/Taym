import datetime
from django.utils import timezone

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser

from user_account_api.validators.registration import ValidatePassword
from user_account_api.validators.new_password import ValidateNewPassword

from django.contrib.auth.hashers import check_password
# from .throttles.user_throttle import LoginAttemptThrottle

from .serializers import PreviousPasswordSerializer

# class TokenGenerator(PasswordResetTokenGenerator):
#     def _make_hash_value(self, user, timestamp):
#         return (
#             text_type(user.pk) + text_type(timestamp) +
#             text_type(user.is_active)
#         )

account_activation_token = PasswordResetTokenGenerator()

class CustomAuthToken(ObtainAuthToken):
    # Include throttle if requested ~~
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})

        try:
            serializer.is_valid(raise_exception=False)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            
            is_expired = user.password_expiration
            date_now = timezone.now()
            user.attempts = 4
            user.save()

            print('Hello')
            if user.is_lock == None:
                print('Here')
                return Response({
                    'status': 'OK',
                    'username': user.username,
                    'token': token.key,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_expired': True if is_expired == 0 else False,
                    'is_parent': user.is_parent,
                    'is_admin': user.is_staff,
                }, status=status.HTTP_200_OK)
            else:
                print('NO')
                if date_now >= user.is_lock:
                    return Response({
                        'status': 'OK',
                        'username': user.username,
                        'token': token.key,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'is_expired': True if is_expired == 0 else False,
                        'is_parent': user.is_parent,
                        'is_admin': user.is_staff,
                    }, status=status.HTTP_200_OK)
                else:
                    print('GG')
                    return Response({'status': 'BAD',
                        'message': '''You have exceeded the limit for invalid password attempt. 
                        Your account will be temporarily locked for 5 minutes.'''},
                        status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            try:
                user = CustomUser.objects.get(username=request.data['username'])
            except CustomUser.DoesNotExist as e:
                return Response({'status': 'BAD', 
                    'message': 'Email and/or password invalid.'}, status=status.HTTP_200_OK)
            else:
                if(user.is_active):
                    if(user.attempts > 0):
                        user.attempts -= 1

                    if(user.attempts == 0):
                        date_now = timezone.now()


                        if user.is_lock == None:
                            user.is_lock = date_now + timezone.timedelta(minutes=5)
                            user.save()
                            return Response({'status': 'BAD',
                                'message': '''You have exceeded the limit for invalid password attempt. 
                                Your account will be temporarily locked for 5 minutes.'''},
                                status=status.HTTP_200_OK)
                        else:
                            if user.is_lock < date_now:
                                user.is_lock = date_now + timezone.timedelta(minutes=5)
                                user.save()
                                return Response({'status': 'BAD',
                                    'message': '''You have exceeded the limit for invalid password attempt. 
                                    Your account will be temporarily locked for 5 minutes.'''},
                                    status=status.HTTP_200_OK)
                            else:
                                user.attempts = 4
                                user.save()
                                return Response({'status': 'BAD', 
                                'message': 'Email and/or password invalid.'}, status=status.HTTP_200_OK)
      
                    else:
                        user.save()
                        return Response({'status': 'BAD', 
                            'message': 'Email and/or password invalid.'}, status=status.HTTP_200_OK)
                else:
                    return Response({'status': 'BAD', 
                        'message': 'Your account has not been activated.'}, status=status.HTTP_200_OK)

class ChangePasswordToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})

        try:
            serializer.is_valid(raise_exception=False)
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)


            email = user.email
            first_name = user.first_name
            last_name = user.last_name
            new_password = request.data['new_password']
            confirm_password = request.data['confirm_password']

            valdiated_password = ValidateNewPassword(
                email, first_name, last_name, new_password, confirm_password
            )

            if valdiated_password:
                return Response(valdiated_password, status=status.HTTP_200_OK)
            else:
                serializer = PreviousPasswordSerializer(data={
                    'user': user.pk,
                    'old_password': user.password,
                    'date_change': timezone.now()
                })
                if serializer.is_valid():
                    user.set_password(new_password)
                    user.password_expiration = 90
                    user.save()
                    serializer.save()
                    return Response({'status': 'OK'}, status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_200_OK)

        except Exception as e:
            try:
                user = CustomUser.objects.get(username=request.data['username'])
                
                is_check = check_password(request.data['password'], user.password)

                if not is_check:
                    if(user.is_active):
                        if(user.attempts > 0):
                            user.attempts -= 1
                        
                        if(user.attempts == 0):
                            date_now = timezone.now()

                            if user.is_lock == None:
                                user.is_lock = date_now + timezone.timedelta(minutes=5)
                                user.save()
                                return Response({'status': 'BAD',
                                    'message': '''You have exceeded the limit for invalid password attempt. 
                                    Your account will be temporarily locked for 5 minutes.'''},
                                    status=status.HTTP_200_OK)
                            else:
                                if user.is_lock < date_now:
                                    user.is_lock = date_now + timezone.timedelta(minutes=5)
                                    user.save()
                                    return Response({'status': 'BAD',
                                        'message': '''You have exceeded the limit for invalid password attempt. 
                                        Your account will be temporarily locked for 5 minutes.'''},
                                        status=status.HTTP_200_OK)
                                else:
                                    user.attempts = 4
                                    user.save()
                                    return Response({'status': 'BAD', 
                                    'message': 'Invalid Password.'}, status=status.HTTP_200_OK)
                        else:
                            user.save()
                            return Response({
                                'message': 'Invalid Password.'}, status=status.HTTP_200_OK)
                    return Response({
                        'message': 'Invalid Password.'}, status=status.HTTP_200_OK)
                        
            except CustomUser.DoesNotExist as e:
                return Response({
                 'message': 'Your email is invalid.'}, status=status.HTTP_200_OK)