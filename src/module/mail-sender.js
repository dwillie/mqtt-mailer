const nodemailer    = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

function MailSender(jsonString) {
  const mailInfo = JSON.parse(jsonString);
  return new Promise((fullfil, reject) => {
    const mailer = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      auth:    {
        user: process.env.MAILER_ADDRESS,
        pass: process.env.MAILER_PWD
      }
    }));
    const options = {
      from:    '"Detox" <info@detox.com>',
      to:      mailInfo.receiver,
      subject: mailInfo.subject,
      html:    mailInfo.message
    };
    mailer.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        fullfil(info.accepted);
      }
    });
  });
}

module.exports = MailSender;
