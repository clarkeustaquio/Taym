import pytz
from django.utils import timezone
from rest_framework import serializers
from .models import TaskHistory

class TaskHistorySerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    start_date = serializers.DateTimeField(format='%b %d, %Y %I:%M:%S %p')
    end_date = serializers.DateTimeField(format='%b %d, %Y %I:%M:%S %p')


    def handle_date(self, date, time_zone='Asia/Manila'):
        timezone_country = date.astimezone(pytz.timezone(time_zone))
        format_date = timezone_country.strftime('%b %d, %Y %I:%M:%S %p')

        return format_date

    class Meta:
        model = TaskHistory
        fields = '__all__'

    def to_representation(self, instance):
        representation = super(TaskHistorySerializer, self).to_representation(instance)

        start_date = instance.start_date
        end_date = instance.end_date

        format_start_date = self.handle_date(start_date)
        format_end_date = self.handle_date(end_date)

        representation['start_date'] = format_start_date
        representation['end_date'] = format_end_date

        return representation
