# Generated by Django 3.1.5 on 2021-02-16 03:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_account_api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='is_approve',
        ),
    ]