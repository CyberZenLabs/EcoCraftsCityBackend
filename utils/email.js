const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
var postmark = require('postmark');

var client = new postmark.ServerClient('9277babd-4736-42f6-b8c5-fcbc211c1152');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    // this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Sam Singer <${process.env.EMAIL_FROM}>`;
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
    console.log(hbsTemplate);
    await client.sendEmail({
      From: 'samsinger@geoeco.co',
      To: 'samsinger@geoeco.co',
      Subject: 'Hello from Postmark',
      HtmlBody: compiledHbsTemplate,
      MessageStream: 'outbound'
    });
    // 1) Render HTML based on a pug template

    // 2) Define email options

    // 3) Create a transport and send email
    // await this.newTransport().sendMail(mailOptions);
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
