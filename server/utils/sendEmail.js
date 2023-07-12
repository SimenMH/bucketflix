import nodemailer from 'nodemailer';
import fs from 'fs';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  dkim: {
    domainName: process.env.SMTP_DOMAIN,
    keySelector: '2017',
    privateKey: process.env.DKIM_PRIVATE_KEY,
  },
});

transporter.verify(function (error, _success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

const verifyEmailHtmlTemplate = fs
  .readFileSync('./views/email-verification-email.html')
  .toString();

export const sendVerificationEmail = async (emailAddress, token) => {
  const verifyEmailHtml = verifyEmailHtmlTemplate
    .replace(/{{email}}/g, emailAddress)
    .replace(/{{token}}/g, token);

  const message = {
    from: 'noreply@simenmh.com',
    to: emailAddress,
    subject: 'Verify your Bucketflix email address',
    html: verifyEmailHtml,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, _info) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });
};

const passwordResetHtmlTemplate = fs
  .readFileSync('./views/password-reset-email.html')
  .toString();

export const sendPasswordResetEmail = async (emailAddress, token) => {
  const resetPasswordHtml = passwordResetHtmlTemplate
    .replace(/{{email}}/g, emailAddress)
    .replace(/{{token}}/g, token);

  const message = {
    from: 'noreply@simenmh.com',
    to: emailAddress,
    subject: 'Reset your Bucketflix password',
    html: resetPasswordHtml,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, _info) => {
      if (error) {
        reject(error);
      }
      resolve(true);
    });
  });
};
