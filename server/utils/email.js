const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Sam Singer <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    const emailTemplateString = fs.readFileSync(
      `${path.resolve('emailViews')}/template.hbs`,
      'utf-8'
    );
    const hbsTemplate = Handlebars.compile(emailTemplateString);

    const compiledHbsTemplate = hbsTemplate({
      firstName: this.firstName,
      url: this.url
    });
    // 1) Render HTML based on a pug template
    const html = '';

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: compiledHbsTemplate,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
