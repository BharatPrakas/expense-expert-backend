const Expense = require('../models').expense;
const People = require('../models').people;
const Lend = require('../models').lending;

const lendingCategoryId = 3;
const lendingDescription = "Lended to ";
const refundDescription = "Refunded from "

const addPeople = async function (req, res) {
  let err;
  let body = req.body;
  let people;
  [err, people] = await to(People.create(body));
  if (people) {
    [err, peopleDetail] = await to(Lend.create({
      "userId": req.user.id,
      "peopleId": people.dataValues.id,
      "amount": 0
    }));
    if (peopleDetail) {
      peopleDetail.dataValues.person = { name: people.dataValues.name };
    }
    if (err) return ReE(res, err, 422);
    return ReS(res, { peopleDetail });
  }
  if (err) return ReE(res, err, 422);
}
module.exports.addPeople = addPeople;

const getPeople = async function (req, res) {
  let err;
  [err, people] = await to(People.findAll({
    where: { userId: req.user.id }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { people });
}
module.exports.getPeople = getPeople;

const addLending = async function (req, res) {
  let err;
  let body = req.body;
  let expense;
  body.userId = req.user.id;
  expenseDetails = {
    "categoryId": lendingCategoryId,
    "amount": body.amount,
    "description": lendingDescription + body.name,
    "userId": req.user.id
  };
  [err, expense] = await to(Expense.create(expenseDetails));
  if (expense) {
    [err, lending] = await to(Lend.findOne({
      where: { id: body.lendingId }
    }));
    if (lending) {
      const balance = lending.dataValues.amount + body.amount;
      [err, lendedDetails] = await to(Lend.update({ "amount": balance }, {
        where: {
          id: body.lendingId
        }
      }));
      if (err) return ReE(res, err, 422);
      return ReS(res, { expense });
    }
  };
  if (err) return ReE(res, err, 422);
}
module.exports.addLending = addLending;

const getLendings = async function (req, res) {
  let err;
  [err, lendingDetails] = await to(Lend.findAll({
    where: { userId: req.user.id },
    include: { model: People, attributes: ['name', 'id'] }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { lendingDetails });
}
module.exports.getLendings = getLendings;

const addRefund = async function (req, res) {
  let err;
  let body = req.body;
  let refund;
  let balance;
  body.userId = req.user.id;
  expenseDetails = {
    "categoryId": lendingCategoryId,
    "amount": -(body.amount),
    "description": refundDescription + body.name,
    "userId": req.user.id
  };
  [err, refund] = await to(Expense.create(expenseDetails));
  if (refund) {
    [err, lendingAmount] = await to(Lend.findOne({
      where: { id: body.lendingId }
    }));
    if (lendingAmount) {
      if (lendingAmount.dataValues.amount > 0) {
        balance = lendingAmount.dataValues.amount - body.amount;
      } else {
        balance = lendingAmount.dataValues.amount + body.amount;
      }
      [err, refundDetails] = await to(Lend.update({ "amount": balance }, {
        where: { id: body.lendingId }
      }));
      if (err) return ReE(res, err, 422);
      return ReS(res, { refund });
    }
  };
  if (err) return ReE(res, err, 422);
}
module.exports.addRefund = addRefund;