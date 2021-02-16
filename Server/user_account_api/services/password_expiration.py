from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

def password_expiration(email_to, name, day):
    try:
        subject = 'KMLNGMLKS Corp.'
        message = 'Your password will expire in ' + day
        email_from = settings.EMAIL_HOST_USER
        email_to = [email_to]

        send_mail(
            subject, message, email_from, email_to,
            fail_silently=True,
            html_message=render_to_string('user_account_api/password_expiration.html', {
                'name': name,
                'day': day
            })
        )
    except Exception as e:
        return False
    else:
        return True