# Admin Authentication Module Documentation

## Overview
This module manages admin authentication for the course management system. It includes functionalities such as admin registration, login, password reset, and password change.

## Models

### Admin Model (`Admin`)
The `Admin` model represents an administrator with authentication capabilities.

#### Fields:

- `email`: (String) - Admin's email, must be unique.
- `password`: (String) - Hashed password stored securely.
- `resetToken`: (String, optional) - Token for password reset.
- `resetTokenExpiration`: (Date, optional) - Expiration date for the reset token.

#### Methods:
- `createResetToken()`: create Token for password reset.
- `validatePassword(password)`: Validates the entered password against the stored hash.

---

## API Endpoints 

### Authentication Endpoints

#### **1. Admin Signup**
`POST /api/v1/admin/auth/signUp`

Registers a new admin account.

**Request Body:**
```json
{
 
  "email": "admin@example.com",
  "password": "securepassword"
}
```
**Responses:**
- `201 Created` 
-{
    "message": "Admin account created successfully.",
    "data": {
        "adminId": "67992ed2e4a29ba7a6042a1d"
    }
}
- `400 Bad Request`
-{
    "message": "Admin already exists. Please log in instead.",
    "data": {}
}

- `500 Internal Server Error` - Error while hashing password.

---

#### **2. Admin Login**
`POST /api/v1/admin/auth/login`

Logs an admin into the system.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```
**Responses:**
- `200 OK` 
-{
    "message": "Admin logged in successfully.",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Nzk5MmVkMmU0YTI5YmE3YTYwNDJhMWQiLCJpYXQiOjE3MzgwOTIzNzEsImV4cCI6MTczODExMDM3MX0.4UTTOAAfi-9r3rk7yim17550A1X0QoMC3_Hm83FGJfo",
        "adminId": "67992ed2e4a29ba7a6042a1d"
    }
}
- `401 Unauthorized` 
in valid password
{
    "message": "Incorrect password. Please try again.",
    "data": {}
}
in valid email
{
    "errors": [
        {
            "type": "field",
            "value": "wafaakadry756@gmail.",
            "msg": "Please enter a valid email.",
            "path": "email",
            "location": "body"
        }
    ]
}
- `500 Internal Server Error` - Server-side error.

---

#### **3. Forgot Password**
`POST /api/admin/forgot-password`

Generates a password reset token and sends it via email.

**Request Body:**
```json
{
  "email": "admin@example.com"
}
```
**Responses:**
- `200 OK` - Reset token sent.
- `404 Not Found` - Email not registered.
- `500 Internal Server Error` - Error generating reset token.

---

#### **4. Reset Password**
`POST /api/admin/reset-password`

Resets the admin password using a valid token.

**Request Body:**
```json
{
  "token": "resetToken",
  "newPassword": "newSecurePassword"
}
```
**Responses:**
- `200 OK` - Password updated.
- `400 Bad Request` - Invalid or expired token.
- `500 Internal Server Error` - Error updating password.

---

#### **5. Change Password**
`POST /api/v1/admin/auth/change-password`

Changes the admin’s password when authenticated.

**Request Body:**
```json
{
  "password": "wafaa15",
  "newpassword": "wafaa15*",
  "confirmNewPass":"wafaa15*"
}
```
**Responses:**
- `200 OK` - Password changed.
{
    "message": "Password updated successfully.",
    "data": {}
}
- `400 Bad Request` 
- Incorrect current password.
{
    "message": "Your current password is incorrect.",
    "data": {}
}
-new password and confirmation not equal
{
    "errors": [
        {
            "type": "field",
            "value": "wafaa25",
            "msg": "New password and confirmation do not match.",
            "path": "confirmNewPass",
            "location": "body"
        }
    ]
}
-fail validation
{
    "errors": [
        {
            "type": "field",
            "value": "wafaa",
            "msg": "New password must be at least 6 characters long.",
            "path": "newpassword",
            "location": "body"
        }
    ]
}
- `500 Internal Server Error` - Error updating password.

---

## Dependencies
This module relies on:
- **bcrypt.js** - For password hashing.
- **jsonwebtoken** - For authentication token management.
- **mongoose** - For MongoDB interaction.
- **nodemailer** - For email-based password reset.

---

## Security Considerations
- **Password hashing:** Uses bcrypt to store passwords securely.
- **JWT authentication:** Issues tokens for login sessions.
- **Reset token expiration:** Ensures reset tokens have limited validity.

---

## Future Enhancements
- Implement multi-factor authentication (MFA).
- Add role-based access control (RBAC).
- Improve email security with verification links.

---

This documentation provides a clear guide for developers working with the admin authentication module. 

