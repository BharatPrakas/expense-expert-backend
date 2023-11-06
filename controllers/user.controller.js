const User = require('../models').users;
const mailService = require('../services/mail.service');
const commonService = require('../services/common.service');
const cryptoService = require('../services/crypto.service');
const messageService = require('../services/message.service');
const { PUSH_NOTIFICATION } = require('../constants/pushNotification');

const createUser = async function (req, res) {
  let err;
  let body = req.body;
  let isMailSended;
  let isNewUser;
  let mailOptions;
  [err, user] = await to(User.findOrCreate({
    where: {
      email: body.email
    },
    defaults: body
  }));
  if (err) return ReE(res, err, 422);
  if (user[1]) {
    console.log(!user[0].dataValues.activated);
    console.log('users', user[0].dataValues);
    const userId = await cryptoService.encrypt(user[0].dataValues.id);
    const data = { name: user[0].dataValues.name, userId: userId };
    const template = commonService.parseTemplate(TEMPLATE.verification_V1, data);
    if (data && template) {
      mailOptions = {
        to: user[0].dataValues.email,
        subject: 'Verification'
      }
      console.log('mailoptions', mailOptions);
      [err, isMailSended] = await to(mailService.sendMail(mailOptions, template));
      if (err) return ReE(res, err, 422);
    };
    if (data) {
      const message = commonService.parseTemplate(PUSH_NOTIFICATION.newUser.body, { name: data.name })
      let body = { token: PUSH_NOTIFICATION.ADMIN_TOKEN, tittle: PUSH_NOTIFICATION.newUser.title, message: message };
      [err, messageSended] = await to(messageService.sendPushNotification(body));
      if (err) return ReE(res, err, 422);
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
  let userId = cryptoService.decrypt(body.token);
  [err, user] = await to(User.update({ activated: true }, {
    where: { id: userId },
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { user });
}
module.exports.activateUser = activateUser;

const changePasswordRequest = async function (req, res) {
  let err;
  let body = req.body;
  let isMailSended;
  [err, user] = await to(User.findOne({
    where: { email: body.email },
    attributes: ['id', 'name', 'email']
  }));
  if (err) return ReE(res, err, 422);
  if (user !== null) {
    if (user.dataValues.email) {
      [err, modified] = await to(User.update({ modified: new Date().setMinutes(new Date().getMinutes() + 15) }, {
        where: { id: user.dataValues.id }
      }));
      if (modified.length) {
        const userId = await cryptoService.encrypt(user.dataValues.id);
        const data = { name: user.dataValues.name, userId: userId };
        const template = commonService.parseTemplate(TEMPLATE.resetPasword, data);
        if (data && template) {
          const mailOptions = {
            to: user.dataValues.email,
            subject: 'Reset password'
          };
          [err, isMailSended] = await to(mailService.sendMail(mailOptions, template));
          if (err) return ReE(res, err, 422);
          return ReS(res, { isMailSended: "Reset password mail sended successfully!" });
        }
      }
      if (err) return ReE(res, err, 422);
      return ReS(res, { modified });
    }
  }
  return ReS(res, { user: user });
}
module.exports.changePasswordRequest = changePasswordRequest;

const updatePassword = async function (req, res) {
  let err;
  let body = req.body;
  const userId = cryptoService.decrypt(req.body.token);
  console.log('userId', userId);
  [err, user] = await to(User.findOne({
    where: { id: userId },
    attributes: ['id', 'name', 'email', 'modified']
  }));
  if (err) return ReE(res, err, 422);
  if (user !== null) {
    const isExpired = user.dataValues.modified.valueOf() < new Date().valueOf();
    if (!isExpired) {
      if (user.dataValues.email) {
        [err, user] = await to(User.update({ password: body.password },
          { where: { id: user.dataValues.id }, individualHooks: true }
        ));
        if (err) return ReE(res, err, 422);
        return ReS(res, { message: "Password reset successfully!" });
      }
    }
    return ReS(res, { isExpired: true });
  }
}
module.exports.updatePassword = updatePassword;

const resendVerificationEmail = async function (req, res) {
  let err, isMailSended;
  let body = req.body;
  [err, user] = await to(User.findOne({ where: { email: body.email } }));
  if (err) return ReE(res, err, 422);
  if (user) {
    const userId = await cryptoService.encrypt(user.dataValues.id);
    const data = { name: user.dataValues.name, userId: userId };
    const template = commonService.parseTemplate(TEMPLATE.verification_V1, data);
    if (data && template) {
      let mailOptions = {
        to: body.email,
        subject: 'Verification'
      }
      console.log('mailoptions', template);
      [err, isMailSended] = await to(mailService.sendMail(mailOptions, template));
      if (err) return ReE(res, err, 422);
    };
  }
  return ReS(res, { isMailSended });
}
module.exports.resendVerificationEmail = resendVerificationEmail;

const serviceRestart = async function (req, res) {
  let err;
  if (err) return ReE(res, err, 422);
  return ReS(res, { message: 'Service restarted successfully!' });
}
module.exports.serviceRestart = serviceRestart;