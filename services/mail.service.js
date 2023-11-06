const nodemailer = require('nodemailer');
let err, response;
const sendMail = async function (mailOption, template) {
  const mailOptions = {
    from: 'Expense Expert' + ' ' + '<' + 'bharathvaj.developer@gmail.com' + '>',
    to: mailOption.to,
    subject: mailOption.subject,
    html: template,
  };
  const transporter = nodemailer.createTransport({
    host: CONFIG.MAIL_HOST,
    port: CONFIG.MAIL_PORT,
    auth: { user: CONFIG.MAIL_ID, pass: CONFIG.PASSWORD }
  });
  [err, response] = await to(transporter.sendMail(mailOptions));
  console.log('error in mail', err, mailOptions.to);
  if (err) TE('error');
  return response;
}
module.exports.sendMail = sendMail;