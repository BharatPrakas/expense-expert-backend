const User = require('../models').users;
const mailService = require('../services/mail.service');
const commonService = require('../services/common.service');

const createUser = async function (req, res) {
  let err;
  let body = req.body;
  let isMailSended;
  let isNewUser;
  [err, user] = await to(User.findOrCreate({
    where: {
      email: body.email
    },
    defaults: body
  }));
  if (err) return ReE(res, err, 422);
  if (user[1]) {
    const data = { name: user[0].dataValues.name, userId: user[0].dataValues.id };
    const template = commonService.parseTemplate(TEMPLATE.verification, data);
    if (data && template) {
      const mailOptions = {
        to: user[0].dataValues.email,
        subject: 'Verification'
      }
      console.log(template);
      [err, isMailSended] = await to(mailService.sendMail(mailOptions, template));
      if (err) return ReE(res, err, 422);
      return ReS(res, { isNewUser: user[1] });
    }
  }
  return ReS(res, { isNewUser: user[1] });
}
module.exports.createUser = createUser;

const getuserInfo = async function (req, res) {
  let err;
  let body = req.body;
  [err, user] = await to(User.findOne({
    where: { id: body.userId },
    attributes: ['name', 'income']
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { user });
}
module.exports.getuserInfo = getuserInfo;

const activateUser = async function (req, res) {
  let err;
  let body = req.body;
  console.log(body);
  [err, user] = await to(User.update(body, {
    where: { id: body.userId },
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { user });
}
module.exports.activateUser = activateUser;