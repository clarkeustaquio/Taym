from django.core.validators import validate_email
from django.core.exceptions import ValidationError


def MyAccountChangeEmail(email):
    validators = dict()

    try:
        validate_email(email)
    except ValidationError:
        validators['invalid_email'] = 'Please enter a valid email address.'
        return validators
    else:
        return validators
