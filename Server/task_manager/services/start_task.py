from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from user_account_api.tokens import account_activation_token

def send_start_task_notification(email_to, name, user, start_date, student, current_task):
    try:
        subject = 'Time'
        message = 'Start Task Notification'
        email_from = settings.DEFAULT_FROM_EMAIL
        email_to = [email_to]

        send_mail(
            subject, message, email_from, email_to,
            fail_silently=False,
            html_message=render_to_string('task_manager/start_task.html', {
                'name': name,
                'start_date': start_date,
                'subject': current_task,
                'student': '{}, {}'.format(student.last_name.title(), student.first_name.title()),
                'email': urlsafe_base64_encode(force_bytes(user.email)),
                'token': account_activation_token.make_token(user)
            })
        )
    except Exception as e:
        return False
    else:
        return True