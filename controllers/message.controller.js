const messageService = require('../services/message.service');
const Notification = require('../models').notification;

const PushNotification = async function (req, res) {
  let err;
  [err, tokens] = await to(Notification.findAll({
    where: { isreceive: true },
    attributes: ['token']
  }));
  if (err) return ReE(res, err, 422);
  if (tokens) {
    token = tokens.map(x => x.dataValues.token);
    let body = { token: token, tittle: req.body.tittle, message: req.body.message };
    [err, messageSended] = await to(messageService.sendPushNotification(body));
    if (err) return ReE(res, err, 422);
    return ReS(res, { messageSended });
  }
}
module.exports.PushNotification = PushNotification;

const setToken = async function (req, res) {
  let err;
  let body = req.body;
  [err, token] = await to(Notification.findOrCreate({
    where: {
      token: body.token
    },
    defaults: { token: body.token, userId: req.user.id }
    // defaults: body
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { token });
}
module.exports.setToken = setToken;

const getToken = async function (req, res) {
  let err;
  let token;
  [err, tokens] = await to(Notification.findAll({
    where: { isreceive: true },
    attributes: ['token']
  }));
  if (err) return ReE(res, err, 422);
  if (tokens) {
    token = tokens.map(x => x.dataValues.token);
  }
  return ReS(res, { token });
}
module.exports.getToken = getToken;