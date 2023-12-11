# My Wallet
Back-end Application. In this application, you can manage your deposits and withdrawals!

# Demo

# How it works
This project is a back-end of an application where you can give descriptions for your deposits and withdrawals, making easier to control them.

## **POST /sign-up**

- In this route, the user can create an account
- All fields are mandatory
- Email must have a valid format. If not, the request returns the status code `422 (Unprocessable Entity)`
- The password must have at least three characters. If not, the request returns status `422 (Unprocessable Entity)`
- If there is already a user with this email registered, the request returns status code `409 (Conflict)`
- If any of the fields are not present or are in an invalid format, the request returns status code `422 (Unprocessable Entity)`
- If successful, the request returns status `201 (Created)`.

## **POST /sign-in**

- In this route, the user can log in if he already has an account
- All fields are mandatory
- Email must have a valid format. If not, the request returns the status code `422 (Unprocessable Entity)`
- If the email is not registered, the request returns status code `404 (Not Found)`
- If the password sent does not match the one registered, the request returns status code `401 (Unauthorized)`
- If any of the fields are not present or are in an invalid format, the request returns status code `422 (Unprocessable Entity)`
- If successful (correct email and password), the request returns status code `200 (OK)` and a token.

## **POST /statements**

- In this route, the user can create his financial transaction
- This route receives the user's authorization token. If it does not receive it, it sends the status `401 (Unauthorized)`
- All fields are mandatory
- If any data is sent to the API in an invalid format, the response is status `422 (Unprocessable Entity)`
- If successful, the request returns status code `201 (Created)`

## **GET /statements**

- In this route, the API sends all user transactions
- This route receives the user's authorization token. If it does not receive it, it sends the status code `401 (Unauthorized)`

# Motivação (opcional)
Este projeto foi feito para praticar a construção de uma SPA usando o React e seus hooks.

# Tecnologies used
For this project, the following technologies were used:

- Node.js;
- MongoDB;

# How to run in development

To execute this project, you need to follow the steps below:

- Clone the repository;
- Download the necessary dependencies with the command: `npm install`;
- Then create the `.env` file based on `.env.example`;
- Finally, run the command `npm run dev`
