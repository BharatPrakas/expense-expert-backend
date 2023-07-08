const User = require('../models').users;

const createUser = async function (req, res) {
  let err;
  let body = req.body;
  [err, user] = await to(User.create(body));
  if (err) return ReE(res, err, 422);
  return ReS(res, { user });
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