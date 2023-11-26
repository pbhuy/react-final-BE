# React Final API

Configure the application according to the format specified in the .env.example file.

Installation all dependency packages

```
npm install
```

How to run it ?

```
npm start
```

After that, the server will be running on port 8080. You can also access it through the browser using the following link: http://localhost:8080.

## Endpoints:

-   Base URL: http://localhost:8080/api

For more detailed API documentation, refer to the Postman collection available [here](https://documenter.getpostman.com/view/24674805/2s9YeD8sif).

-   Auth workflow:

-   /auth/register: Creates a new account and sends an activation email.

-   /auth/activation: Activates the account using the activation token.

-   /auth/login: Validates credentials and provides tokens for logged-in users.

-   /auth/google: Handles login via Google authentication.

    -   Workflow:

    1. FE call: /accounts/auth/auth/google
    2. Select google account to login
    3. Handle login after callback from google:
        - /accounts/auth/login/failed: in case of login failure.
        - /accounts/auth/login/success: in case of login success (register if the account is not found, log in if the account exists).

-   /auth/facebook: Creates a new account and sends an activation email. ()

-   /auth/refresh: Generates a new access token using a refresh token.

-   /auth/forgot: Initiates the process for resetting a forgotten password.

-   /auth/reset: Updates the password after a reset request.

-   /auth/profile: Retrieves user profile information.

-   /auth/update: Updates user profile information.
