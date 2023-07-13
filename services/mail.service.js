// ------ mail config ------
const nodemailer = require('nodemailer');
let err, response;
const sendMail = async function (mailOption, template) {
  const mailOptions = {
    to: mailOption.to,
    subject: mailOption.subject,
    html: template,
  };
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: CONFIG.MAIL_ID,
      pass: CONFIG.PASSWORD,
    }
  });
  [err, response] = await to(transporter.sendMail(mailOptions));
  console.log('error in mail', err, mailOptions.to);
  if (err) TE('error');
  return response;
}
module.exports.sendMail = sendMail;