# Generated by Django 3.2 on 2021-04-10 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task_manager', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskhistory',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
