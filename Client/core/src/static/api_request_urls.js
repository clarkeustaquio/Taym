// Login and Logout

export const domain = 'http://localhost:8000/'
const remote = 'https://taym.herokuapp.com/'

export const login_request_url = `${domain}api/login/`
export const logout_request_url = `${domain}api/logout/`

// Account activation
export const activate_account_request_url = `${domain}api/activate-account/`
export const activate_child_request_url = `${domain}api/activate-child/`

// Reset Password
export const reset_password_request_url = `${domain}api/reset-password/`
export const validate_reset_password_request_url = `${domain}api/validate-reset-password/`

// Validate Email
export const validate_email_exist_request_url = `${domain}api/validate-email-exist/`

// Registration
export const registration_request_url = `${domain}api/register/`
export const registration_parent_request_url = `${domain}api/register-parent/`

// Token auth
export const authorize_token_request_url = `${domain}api/authorize-token/`

export const registration_get_request_url = `${domain}api/registration-get-request/`