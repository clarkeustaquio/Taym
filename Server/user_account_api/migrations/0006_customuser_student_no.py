# Generated by Django 3.1.7 on 2021-04-10 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_account_api', '0005_auto_20210408_0754'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='student_no',
            field=models.CharField(default='1', max_length=150),
        ),
    ]