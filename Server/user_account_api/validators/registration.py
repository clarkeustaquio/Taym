import re

from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password

from user_account_api.models import PreviousPassword, CustomUser

from english_words import english_words_set

def ValidateEmail(email):
    validators = dict()

    try:
        validate_email(email)
    except ValidationError:
        validators['invalid_email'] = 'Please enter a valid email address.'
        return validators
    else:
        return validators


def ValidateDictionary(password):
    english_dictionary = sorted(english_words_set, key=len)[26:]

    for word in english_dictionary:
        if len(word) >= 3:
            if word in password:
                return word

    return False


def ValidatePassword(
    email,
    first_name,
    last_name,
    password,
    confirm_password
):

    validators = dict()

    if password == confirm_password:
        if len(password) < 10:
            validators['invalid_length'] = 'Password must be at least (10) characters long.'

        if not re.findall('\d', password):
            validators['invalid_digit'] = 'Password must contain at least 1 digit, 0-9.'

        if not re.findall('[A-Z]', password):
            validators['invalid_uppercase'] = 'Password must contain at least 1 uppercase letter, A-Z.'

        if not re.findall('[a-z]', password):
            validators['invalid_lowercase'] = 'Password must contain at least 1 lowercase letter, a-z.'

        if not re.findall('[()[\]{}|\\`~!@#$%^&*_\-+=;:\'",<>./?]', password):
            validators['invalid_special'] = 'Password must contain at least 1 special character.'

        if(len(first_name) > 0 and len(last_name) > 0):
            if first_name.lower() in password.lower():
                validators['invalid_firstName'] = 'Password must not contain your first name.'

            if last_name.lower() in password.lower():
                validators['invalid_lastName'] = 'Password must not contain your last name.'

        validate_in_dictionary = ValidateDictionary(password)

        if validate_in_dictionary:
            validators['invalid_in_dictionary'] = 'Password must not contain dictionary words. (Dictionary: {})'.format(
                validate_in_dictionary)

        return validators
    else:
        validators['invalid_password'] = 'Password do not match.'
        return validators


def ValidateRegistration(
        email, username, first_name, last_name, middle_name,
        password, confirm_password):
    cleaned_data = dict()

    validate_email = ValidateEmail(email)

    validate_password = ValidatePassword(
        email, first_name, last_name, password, confirm_password)

    cleaned_data.update(validate_email)
    cleaned_data.update(validate_password)

    return cleaned_data
