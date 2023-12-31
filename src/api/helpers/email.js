require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const oauth2client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

const sendEmailRegister = (mailTo, url, text) => {
  oauth2client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.ADMIN_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken
    }
  });
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: mailTo,
    subject: 'ACTIVE YOUR ACCOUNT',
    html: `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
            rel="stylesheet"
          />
          <title>MovieBooking | Account Activation</title>
          <style>
            body {
              background-color: #333333;
              height: 100vh;
              font-family: "Roboto", sans-serif;
              color: #fff;
              position: relative;
              text-align: center;
            }
            .container {
              max-width: 700px;
              width: 100%;
              height: 100%;
              margin: 0 auto;
            }
            .wrapper {
              padding: 0 15px;
            }
            .card {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
            }
            span {
              color: #ffc107;
            }
            button {
              padding: 1em 6em;
              border-radius: 5px;
              border: 0;
              background-color: hsl(45, 100%, 51%);
              transition: all 0.3s ease-in;
              cursor: pointer;
            }
            button:hover {
              background-color: hsl(45, 70%, 51%);
              transition: all 0.3s ease-in;
            }
            .spacing {
              margin-top: 5rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="wrapper">
              <div class="card">
                <h1><span>Welcome !</span> And thank you for registering !</h1>
                <p>Please validate your email by clicking the button below 🙂</p>
                <a href=${url}><button>${text}</button></a>
                <p class="spacing">
                  If the button above does not work, please navigate to the link
                  provided below 👇🏻
                </p>
                <div>${url}</div>
              </div>
            </div>
          </div>
        </body>
      </html>`
  };
  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};
const sendEmailReset = (mailTo, url, text, name) => {
  oauth2client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.ADMIN_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken
    }
  });
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: mailTo,
    subject: 'RESET YOUR PASSWORD',
    html: `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
            rel="stylesheet"
          />
          <title>MovieBooking | Reset Password</title>
          <style>
            body {
              background-color: #333333;
              height: 100vh;
              font-family: "Roboto", sans-serif;
              color: #fff;
              position: relative;
              text-align: center;
            }
            .container {
              max-width: 700px;
              width: 100%;
              height: 100%;
              margin: 0 auto;
            }
            .wrapper {
              padding: 0 15px;
            }
            .card {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
            }
            span {
              color: #ffc107;
            }
            button {
              padding: 1em 6em;
              border-radius: 5px;
              border: 0;
              background-color: hsl(45, 100%, 51%);
              transition: all 0.3s ease-in;
              cursor: pointer;
            }
            button:hover {
              background-color: hsl(45, 70%, 51%);
              transition: all 0.3s ease-in;
            }
            .spacing {
              margin-top: 5rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="wrapper">
              <div class="card">
                <h1><span>Hey</span> ${name}</h1>
                <p>Please click the button below to reset your password. 🙂</p>
                <a href=${url}><button>${text}</button></a>
                <p class="spacing">
                  If the button above does not work, please navigate to the link
                  provided below 👇🏻
                </p>
                <div>${url}</div>
              </div>
            </div>
          </div>
        </body>
        </html>`
  };
  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};
const sendEmailInvite = (mailTo, url, text, name, className) => {
  oauth2client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
  const accessToken = oauth2client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.ADMIN_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken
    }
  });
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: mailTo,
    subject: 'INVITATION FOR CLASS',
    html: `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap"
            rel="stylesheet"
          />
          <title>MovieBooking | Reset Password</title>
          <style>
            body {
              background-color: #333333;
              height: 100vh;
              font-family: "Roboto", sans-serif;
              color: #fff;
              position: relative;
              text-align: center;
            }
            .container {
              max-width: 700px;
              width: 100%;
              height: 100%;
              margin: 0 auto;
            }
            .wrapper {
              padding: 0 15px;
            }
            .card {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
            }
            span {
              color: #ffc107;
            }
            button {
              padding: 1em 6em;
              border-radius: 5px;
              border: 0;
              background-color: hsl(45, 100%, 51%);
              transition: all 0.3s ease-in;
              cursor: pointer;
            }
            button:hover {
              background-color: hsl(45, 70%, 51%);
              transition: all 0.3s ease-in;
            }
            .spacing {
              margin-top: 5rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="wrapper">
              <div class="card">
              <h1>Welcome to ${className}!</h1>
              <p>Dear ${name},</p>
              <p>We are excited to invite you to join our upcoming class. Click the button below to access the class details and confirm your participation.</p>
              <a href="${url}"><button>${text}</button></a>
              <p class="spacing">If you encounter any issues with the button above, you can also access the class by copying and pasting the link below into your browser:</p>
              <div>${url}</div>              
              </div>
            </div>
          </div>
        </body>
        </html>`
  };
  smtpTransport.sendMail(mailOptions, (err, info) => {
    if (err) return { err };
    return info;
  });
};
module.exports = { sendEmailRegister, sendEmailReset, sendEmailInvite };
