const { options } = require("mongoose");
const nodemailer = require("nodemailer");
const { __esModule } = require("validator/lib/isAlpha");

const sendEmail = async options => {
    //1) Create a transporter

    var transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6fb0ef9565d373",
          pass: "9be5a06f637567"
        }
      });
    //2) Definie the email options 
    
    const mailOptions = {
     from: "Sam Singer sam.singer79@gmail.com",
     to: options.email,
     subject: options.subject,
     text: options.message,
     
    }
    //3) Actually send the email with nodemailer
    await transporter.sendMail(mailOptions)
}
module.exports = sendEmail;