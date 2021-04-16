from rest_framework import serializers
from .models import CustomUser, PreviousPassword, Subject
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    # Not needed for the mean time
    class Meta:
        model = CustomUser
        # fields = ('id', 'username', 'email', 'password', 'is_approve')
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'is_active', 'last_login')

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class PreviousPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreviousPassword
        fields = ('user', 'old_password', 'date_change')