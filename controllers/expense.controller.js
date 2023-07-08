const moment = require('moment');
const { Op } = require("sequelize");
const Expense = require('../models').expense;
const Categories = require('../models').categories;
const Budget = require('../models').budget;

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

const getCategory = async function (req, res) {
  let err;
  let body = req.body;
  [err, category] = await to(Categories.findAll());
  if (err) return ReE(res, err, 422);
  return ReS(res, { category });
}
module.exports.getCategory = getCategory;

const getCategories = async function (req, res) {
  let err;
  let body = req.body;
  [err, category] = await to(Categories.findAll({
    where: {
      [Op.or]: [{ userId: null }, { userId: body.userId }]
    },
    order: [['created']]
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { category });
}
module.exports.getCategories = getCategories;

const addCategory = async function (req, res) {
  let err;
  let body = req.body;
  [err, newCategory] = await to(Categories.create(body));
  if (err) return ReE(res, err, 422);
  const data = {
    userId: newCategory.dataValues.userId,
    categoryId: newCategory.dataValues.id,
  };
  [err, newBudget] = await to(Budget.create(data));
  return ReS(res, { newBudget });
}
module.exports.addCategory = addCategory;

const deleteCategory = async function (req, res) {
  let err;
  let body = req.body;
  [err, deleteBudget] = await to(Budget.destroy({
    where: {
      categoryId: body.categoryId,
    }
  }));
  if (err) return ReE(res, err, 422);
  if (deleteBudget) {
    [err, deletedCategory] = await to(Categories.destroy({
      where: {
        id: body.categoryId,
      }
    }));
    return ReS(res, { deletedCategory });
  }
  return ReS(res, { deleteBudget });
}
module.exports.deleteCategory = deleteCategory;

const addExpense = async function (req, res) {
  let err;
  let body = req.body;
  [err, expense] = await to(Expense.create(body));
  if (err) return ReE(res, err, 422);
  return ReS(res, { expense });
}
module.exports.addExpense = addExpense;

const getExpenses = async function (req, res) {
  let err;
  let body = req.body;
  [err, allExpense] = await to(Expense.findAll({
    include: [
      { model: Categories, attributes: ['name'] }
    ],
    where: {
      userId: body.userId,
    },
    order: [
      ['created', 'DESC'],
    ],
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { allExpense });
}
module.exports.getExpenses = getExpenses;

const getExpense = async function (req, res) {
  let err;
  let body = req.body;
  [err, expense] = await to(Expense.findOne({
    include: [
      { model: Categories, attributes: ['name'] }
    ],
    where: {
      id: body.id,
    },
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { expense });
}
module.exports.getExpense = getExpense;

const todayExpenses = async function (req, res) {
  let err;
  let body = req.body;
  const today = new Date();
  let todayExpense = 0;
  [err, allExpense] = await to(Expense.findAll({
    where: {
      created: {
        [Op.between]: [
          moment.utc(today).format('YYYY-MM-DD 00:00:00'),
          moment.utc(today).format('YYYY-MM-DD 23:59:59')
        ]
      },
      userId: body.userId
    },
  }));
  allExpense.forEach(expense => {
    todayExpense += expense.amount;
  });
  if (err) return ReE(res, err, 422);
  return ReS(res, { todayExpense });
}
module.exports.todayExpenses = todayExpenses;

const currentMonthExpense = async function (req, res) {
  let err;
  let body = req.body;
  let monthlyExpense = 0;
  const today = moment.utc().startOf('day');;
  const firstDay = moment.utc().startOf('month');
  [err, monthExpense] = await to(Expense.findAll({
    where: {
      created: {
        [Op.between]: [
          moment.utc(firstDay).format('YYYY-MM-DD 00:00:00'),
          moment.utc(today).format('YYYY-MM-DD 23:59:59')
        ]
      },
      userId: body.userId
    },
  }));
  monthExpense.forEach(expense => {
    monthlyExpense += expense.amount;
  });
  if (err) return ReE(res, err, 422);
  return ReS(res, { monthlyExpense });
}
module.exports.currentMonthExpense = currentMonthExpense;

const categoryExpense = async function (req, res) {
  let err, data;
  let body = req.body;
  let Amount = 0;
  let categoryList = [];
  const today = moment.utc().startOf('day');
  const firstDay = moment.utc().startOf('month');
  [err, data] = await to(Categories.findAll({
    include: {
      model: Expense,
      where: {
        created: {
          [Op.between]: [
            moment.utc(firstDay).format('YYYY-MM-DD 00:00:00'),
            moment.utc(today).format('YYYY-MM-DD 23:59:59')
          ]
        },
        userId: body.userId,
      },
      attributes: ['amount']
    },
    attributes: ['name', 'id'],
  }));
  if (err) return ReE(res, err, 422);
  if (data && data.length) {
    for (let i = 0; i < data.length; i++) {
      Amount = 0;
      for (let j = 0; j < data[i].dataValues.expenses.length; j++) {
        Amount += data[i].dataValues.expenses[j].dataValues.amount;
      }
      categoryList.push({ id: data[i].dataValues.id, name: data[i].dataValues.name, amount: Amount });
    };
  };
  return ReS(res, { categoryList });
}
module.exports.categoryExpense = categoryExpense;

const getWeeklyExpense = async function (req, res) {
  let err;
  let body = req.body;
  const today = new Date();
  let weekExpense = [];
  let amount = 0;
  const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  for (let i = 0; i < weeks.length; i++) {
    amount = 0;
    let days = today.setDate(today.getDate() - today.getDay() + i + 1);
    [err, weeklyExpense] = await to(Expense.findAll({
      where: {
        created: {
          [Op.between]: [
            moment.utc(days).format('YYYY-MM-DD 00:00:00'),
            moment.utc(days).format('YYYY-MM-DD 23:59:59'),
          ],
        },
        userId: body.userId,
      },
      attributes: ['amount', 'created']
    }));
    for (let j = 0; j < weeklyExpense.length; j++) {
      amount += weeklyExpense[j].dataValues.amount;
    };
    weekExpense.push({ day: weeks[i], amount: amount });
  }

  if (err) return ReE(res, err, 422);
  return ReS(res, { weekExpense });
}
module.exports.getWeeklyExpense = getWeeklyExpense;

const getBudget = async function (req, res) {
  let err;
  let body = req.body;
  [err, budget] = await to(Budget.findAll({
    include:
      { model: Categories },
    where: {
      userId: body.userId,
    },
    attributes: ['id', 'limit']
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { budget });
}
module.exports.getBudget = getBudget;

const setBudget = async function (req, res) {
  let err;
  let body = req.body;
  [err, createdBudget] = await to(Budget.create(body));
  if (err) return ReE(res, err, 422);
  return ReS(res, { createdBudget });
}
module.exports.setBudget = setBudget;

const updateBudget = async function (req, res) {
  let err;
  let body = req.body;
  [err, updatedBudget] = await to(Budget.update(body, {
    where: {
      id: body.id,
    }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { updatedBudget });
}
module.exports.updateBudget = updateBudget;


const updateExpense = async function (req, res) {
  let err;
  let body = req.body;
  [err, updatedExpense] = await to(Expense.update(body, {
    where: {
      id: body.id,
    }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { updatedExpense });
}
module.exports.updateExpense = updateExpense;

const deleteExpense = async function (req, res) {
  let err;
  let body = req.body;
  [err, deletedExpense] = await to(Expense.destroy({
    where: {
      id: body.id,
    }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { deletedExpense });
}
module.exports.deleteExpense = deleteExpense;

const dateFilter = async function (req, res) {
  let err;
  let body = req.body;
  if (body.mode === 1) {
    switch (body.range) {
      /** today **/
      case 'today':
        const today = moment.utc().startOf('day');
        [err, records] = await to(Expense.findAll({
          include: {
            model: Categories
          },
          where: {
            created: {
              [Op.between]: [
                moment.utc(today).format('YYYY-MM-DD 00:00:00'),
                moment.utc(today).format('YYYY-MM-DD 23:59:59'),
              ],
            },
            userId: body.userId,
          },
        }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { records });
      //** yesterday **//
      case 'yesterday':
        const yesterday = moment.utc().subtract(1, 'day');
        [err, records] = await to(Expense.findAll({
          include: {
            model: Categories
          },
          where: {
            created: {
              [Op.between]: [
                moment.utc(yesterday).format('YYYY-MM-DD 00:00:00'),
                moment.utc(yesterday).format('YYYY-MM-DD 23:59:59'),
              ],
            },
            userId: body.userId,
          },
        }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { records });
      //** this week **//
      case 'this week':
        const currentDate = moment().utc();
        const startDate = currentDate.clone().startOf('isoWeek');
        const endDate = currentDate.clone().endOf('isoWeek');
        [err, records] = await to(Expense.findAll({
          include: {
            model: Categories
          },
          where: {
            created: {
              [Op.between]: [
                moment.utc(startDate).format('YYYY-MM-DD 00:00:00'),
                moment.utc(endDate).format('YYYY-MM-DD 23:59:59'),
              ],
            },
            userId: body.userId,
          },
        }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { records });
      //** this month **//
      case 'this month':
        const date = moment().utc();
        const monthStart = date.clone().startOf('month').utc();
        const monthEnd = date.clone().endOf('month').utc();
        [err, records] = await to(Expense.findAll({
          include: {
            model: Categories
          },
          where: {
            created: {
              [Op.between]: [
                moment.utc(monthStart).format('YYYY-MM-DD 00:00:00'),
                moment.utc(monthEnd).format('YYYY-MM-DD 23:59:59'),
              ],
            },
            userId: body.userId,
          },
        }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { records });
    }
  }
}
module.exports.dateFilter = dateFilter;

