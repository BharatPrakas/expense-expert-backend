const moment = require('moment');
const { Op } = require("sequelize");
const Earned = require('../models').earned;
const Category = require('../models').earnedcategory;
const User = require('../models').users;

const createEarning = async function (req, res) {
  let err;
  let body = req.body;
  body.userId = req.user.id;
  [err, earnings] = await to(Earned.create(body));
  if (err) return ReE(res, err, 422);
  return ReS(res, { earnings });
}
module.exports.createEarning = createEarning;

const getEarnedCategory = async function (req, res) {
  let err;
  let body = req.body;
  [err, categories] = await to(Category.findAll({
    where: {
      [Op.or]: [{ userId: null }, { userId: req.user.id }]
    },
    attributes: ['id', 'name'],
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { categories });
}
module.exports.getEarnedCategory = getEarnedCategory;

const getEarnings = async function (req, res) {
  let err;
  let body = req.body;
  [err, earnings] = await to(Earned.findAll({
    include: { model: Category, attributes: ['name'] },
    where: { userId: req.user.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { earnings });
}
module.exports.getEarnings = getEarnings;

const getMonthEarning = async function (req, res) {
  let err;
  let body = req.body;
  let monthEarning = 0;
  const today = moment.utc().startOf('day');;
  const firstDay = moment.utc().startOf('month');
  [err, allEarnings] = await to(Earned.findAll({
    include: { model: Category, attributes: ['name'] },
    where: {
      created: {
        [Op.between]: [
          moment.utc(firstDay).format('YYYY-MM-DD 00:00:00'),
          moment.utc(today).format('YYYY-MM-DD 23:59:59')
        ]
      },
      userId: req.user.id,
    }
  }));
  if (allEarnings) {
    for (let i = 0; i < allEarnings.length; i++) {
      monthEarning += allEarnings[i].dataValues.amount;
    }
  }
  if (err) return ReE(res, err, 422);
  return ReS(res, { monthEarning: monthEarning });
}
module.exports.getMonthEarning = getMonthEarning;

const getIncome = async function (req, res) {
  let err;
  let body = req.body;
  [err, userIncome] = await to(User.findOne({
    where: { id: req.user.id },
    attributes: ['income'],
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { userIncome });
}
module.exports.getIncome = getIncome;

const updateIncome = async function (req, res) {
  let err;
  let body = req.body;
  [err, updatedIncome] = await to(User.update(body, {
    where: { id: req.user.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { updatedIncome });
}
module.exports.updateIncome = updateIncome;

const getEarning = async function (req, res) {
  let err;
  let body = req.body;
  [err, earning] = await to(Earned.findOne({
    where: { id: body.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { earning });
}
module.exports.getEarning = getEarning;

const updateEarning = async function (req, res) {
  let err;
  let body = req.body;
  [err, updatedEarning] = await to(Earned.update(body, {
    where: { id: body.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { updatedEarning });
}
module.exports.updateEarning = updateEarning;

const deleteEarning = async function (req, res) {
  let err;
  let body = req.body;
  [err, deletedEarning] = await to(Earned.destroy({
    where: { id: body.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { deletedEarning });
}
module.exports.deleteEarning = deleteEarning;