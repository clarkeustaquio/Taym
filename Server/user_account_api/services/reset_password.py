from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from user_account_api.tokens import account_activation_token


def send_reset_password(email_to, name, user):
    try:
        subject = 'KMLNGMLKS Corp.'
        message = 'Account password reset'
        email_from = settings.EMAIL_HOST_USER
        email_to = [email_to]

        site = 'localhost:3000/reset-password/'

        send_mail(
            subject, message, email_from, email_to,
            fail_silently=True,
            html_message=render_to_string('user_account_api/reset_password.html', {
                'name': name,
                'domain': site,
                'email': urlsafe_base64_encode(force_bytes(user.email)),
                'token': account_activation_token.make_token(user)
            })
        )
    except Exception as e:
        return False
    else:
        return True