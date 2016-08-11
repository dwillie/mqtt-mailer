const validator     = require('validator');
const nodemailer    = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const consts        = require('../support/constants.js');

function MailSender(jsonString) {
  const mailInfo = JSON.parse(jsonString);
  return new Promise((fullfil, reject) => {
    if (validator.isEmail(mailInfo.receiver)) {
      const mailer = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth:    {
          user: consts.mailerAddress,
          pass: consts.mailerPwd
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
    } else {
      reject(new Error(`Email address ${mailInfo.receiver} is not valid`));
    }
  });
}

module.exports = MailSender;
