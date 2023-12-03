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

## Authentication Endpoints:

- Base URL: http://localhost:8080/api

For more detailed API documentation, refer to the Postman collection available [here](https://documenter.getpostman.com/view/24674805/2s9YeD8sif).

- Auth workflow:

- /auth/register: Creates a new account and sends an activation email.

- /auth/activation: Activates the account using the activation token.

- /auth/login: Validates credentials and provides tokens for logged-in users.

- /auth/google: Handles login via Google authentication.

  - Workflow:

  1. FE call: /accounts/auth/auth/google
  2. Select google account to login
  3. Handle login after callback from google:
     - /accounts/auth/login/failed: in case of login failure.
     - /accounts/auth/login/success: in case of login success (register if the account is not found, log in if the account exists).

- /auth/facebook: Creates a new account and sends an activation email. ()

- /auth/refresh: Generates a new access token using a refresh token.

- /auth/forgot: Initiates the process for resetting a forgotten password.

- /auth/reset: Updates the password after a reset request.

- /auth/profile: Retrieves user profile information.

- /auth/update: Updates user profile information.

## Scores Management endpoints:

P/s

- all enpoints below start with "/score/mock"
- with error request, will return

  ```{
  success: false,
  error: {
    message: err.message,
  },
  }
  ```

- `GET /semesters`
  - get all semester data
  - no params
- `GET /scoretypes`

  - get all score type data
  - no params

- `GET /subjects`

  - get subjects of a teacher in a semester
  - `const { teacherId, semesterId } = req.query;`

- `POST /grade-structure`

  - Show current grade structure
  - `const { teacherId, subjectId, semesterId } = req.body`

- `POST /add-grade-composition`

  - Add a grade composition with a name and grade scale (only choose in grade structure list)
  - `const { subjectId, teacherId, semester, scoreTypeId, percentage } = req.body;`

- `POST /remove-grade-composition`

  - Remove a grade composition
  - `const { subjectId, teacherId, semester, scoreTypeId } = req.body;`

- `POST /update-grade-composition`

  - Update a grade composition (name, grade scale)
  - Mark a grade composition as finalized (update `isPublish` key)
  - `const { subjectId, teacherId, semesterId, scoreTypeId, newScoreTypeName, isPublish } = req.body;`

- `POST /add-students`
  - WIP
- `GET /scores`

  - Show Students (pre-upload full student list) x Grades board
  - Show total grade column at grade board
  - `const { subjectId, teacherId, semesterId } = req.query;`

- `POST /scores`

  - Mark the final decision for a student review with an updated grade
  - Input grade for a student at a specific assignment
  - `const { studentId, teacherId, semesterId, subjectId, scoreTypeId, scoreValue } = req.query;`

- `GET /reviews-requested`

  - View list of grade reviews requested by students (for teacher)
  - `const { subjectId, teacherId, semesterId } = req.query;`

- `GET /review-requested-detail`

  - View grade review details: Student, grade composition, current grade, student expectation grade, student explanation
  - `const { subjectId, teacherId, semesterId, reviewRequestedId } = req.query`

- `POST /comment-review`
  - Comment on a student review
  - `const { userId, reviewRequestedId, content } = req.body`
