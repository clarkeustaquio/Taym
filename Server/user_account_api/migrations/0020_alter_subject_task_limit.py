# Generated by Django 3.2.2 on 2021-07-02 01:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_account_api', '0019_auto_20210702_0120'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subject',
            name='task_limit',
            field=models.TimeField(default=None, null=True),
        ),
    ]
