from .registration import ValidateEmail, ValidatePassword
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password

from user_account_api.models import PreviousPassword, CustomUser


def ValidatePreviousPassword(
    email,
    first_name,
    last_name,
    password,
    confirm_password
):

    validators = dict()
    is_registered = False

    try:
        user = CustomUser.objects.get(email=email)
        old_password = PreviousPassword.objects.filter(
            user=user.id).order_by('-date_change')
    except CustomUser.DoesNotExist as e:
        is_registered = False
    else:
        is_registered = True

    validate_password = ValidatePassword(
        email, first_name, last_name, password, confirm_password
    )

    if password == confirm_password:
        if is_registered:
            for hashed_password in old_password[:6]:
                if check_password(password, hashed_password.old_password):
                    validators['invalid_previous'] = 'Password must not be the same with the last 6 previous passwords'
                    break

    validators.update(validate_password)

    return validators


def ValidateNewPassword(email, first_name, last_name, password, confirm_password):
    cleaned_data = dict()

    validate_email = ValidateEmail(email)

    validate_password = ValidatePreviousPassword(
        email, first_name, last_name, password, confirm_password)

    cleaned_data.update(validate_email)
    cleaned_data.update(validate_password)

    return cleaned_data
