const moment = require('moment');
const { Op, literal } = require("sequelize");
const Expense = require('../models').expense;
const Earned = require('../models').earned;
const Categories = require('../models').categories;
const Budget = require('../models').budget;
const EarnedCategory = require('../models').earnedcategory;
const commonService = require('../services/common.service');
const cryptoService = require('../services/crypto.service');

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
      [Op.or]: [{ userId: null }, { userId: req.user.id }],
    },
    order: [['id']]
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { category });
}
module.exports.getCategories = getCategories;

const sortCategory = async function (req, res) {
  let err;
  let body = req.body;
  category = [];
  const lendingCategoryId = 3;
  [err, categoryRecords] = await to(Categories.findAll({
    where: {
      [Op.or]: [{ userId: null }, { userId: body.userId }],
      [Op.not]: { id: lendingCategoryId }
    },
    attributes: ['id', 'name']
  }));
  if (categoryRecords && categoryRecords.length) {
    for (let i = 0; i < categoryRecords.length; i++) {
      [err, respon] = await to(Expense.count({
        where: {
          [Op.and]: [{ categoryId: categoryRecords[i].dataValues.id }, { userId: body.userId }],
        },
      }));
      category.push({
        id: categoryRecords[i].dataValues.id,
        name: categoryRecords[i].dataValues.name,
        count: respon
      });
    };
  };
  for (let i = 0; i < category.length; i++) {
    for (let j = 0; j < category.length; j++) {
      console.log(category[i].count, category[j].count);
      if (category[i].count > category[j].count) {
        let temp = category[i];
        category[i] = category[j];
        category[j] = temp;
      }
    }
  }
  if (err) return ReE(res, err, 422);
  return ReS(res, { category });
}
module.exports.sortCategory = sortCategory;

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
  if (newBudget) {
    newCategory.dataValues.limit = newBudget.dataValues.limit;
  }
  return ReS(res, { newCategory });
}
module.exports.addCategory = addCategory;

const deleteCategory = async function (req, res) {
  let err;
  let body = req.body;
  [err, deleteBudget] = await to(Budget.destroy({
    where: { categoryId: body.categoryId }
  }));
  if (err) return ReE(res, err, 422);
  if (deleteBudget) {
    [err, deletedCategory] = await to(Categories.destroy({
      where: { id: body.categoryId }
    }));
    return ReS(res, { deletedCategory });
  }
  return ReS(res, { deleteBudget });
}
module.exports.deleteCategory = deleteCategory;

const addExpense = async function (req, res) {
  let err;
  let body = req.body;
  body.userId = req.user.id;
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
      { model: Categories, attributes: ['name', 'icon', 'color'] }
    ],
    attributes: ['id', [literal('ABS(amount)'), 'amount'], 'description', 'created'],
    where: { userId: req.user.id, },
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
  let id = cryptoService.decrypt(body.id);
  [err, expense] = await to(Expense.findOne({
    include: [
      { model: Categories, attributes: ['name'] }
    ],
    where: { id: id },
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
      userId: req.user.id
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
      userId: req.user.id
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
        userId: req.user.id,
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
        userId: req.user.id,
      },
      attributes: ['amount', 'created']
    }));
    for (let j = 0; j < weeklyExpense.length; j++) {
      amount += weeklyExpense[j].dataValues.amount;
    };
    weekExpense.push({ day: weeks[i], amount: amount });
  };
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
      userId: req.user.id,
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
  [err, createdBudget] = await to(Budget.findOrCreate({
    where: {
      userId: req.user.id,
      categoryId: body.categoryId,
    },
    defaults: body,
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { createdBudget });
}
module.exports.setBudget = setBudget;

const updateBudget = async function (req, res) {
  let err;
  let body = req.body;
  [err, updatedBudget] = await to(Budget.update(body, {
    where: {
      [Op.and]: [{ id: body.id }, { userId: req.user.id }]
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
    where: { id: body.id, }
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { updatedExpense });
}
module.exports.updateExpense = updateExpense;

const deleteExpense = async function (req, res) {
  let err;
  let body = req.body;
  [err, deletedExpense] = await to(Expense.destroy({
    where: { id: body.id }
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
      case 'Today':
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
            userId: req.user.id,
          },
          order: [
            ['created', 'DESC'],
          ],
        }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { records });
      //** yesterday **//
      case 'Yesterday':
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
            userId: req.user.id,
          },
          order: [
            ['created', 'DESC'],
          ],
        }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { records });
      //** this week **//
      case 'This week':
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
            userId: req.user.id,
          },
          order: [
            ['created', 'DESC'],
          ],
        }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { records });
      //** this month **//
      case 'This month':
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
            userId: req.user.id,
          },
          order: [
            ['created', 'DESC'],
          ],
        }));
        if (err) return ReE(res, err, 422);
        return ReS(res, { records });
    }
  } else {
    if (body.mode === 2) {
      switch (body.range) {
        /** today **/
        case 'Today':
          const today = moment.utc().startOf('day');
          [err, records] = await to(Earned.findAll({
            include: {
              model: EarnedCategory
            },
            where: {
              created: {
                [Op.between]: [
                  moment.utc(today).format('YYYY-MM-DD 00:00:00'),
                  moment.utc(today).format('YYYY-MM-DD 23:59:59'),
                ],
              },
              userId: req.user.id,
            },
            order: [
              ['created', 'DESC'],
            ],
          }));
          if (records) {
            records.forEach((x) => {
              x.dataValues.category = x.dataValues.earnedcategory.name;
            });
          }
          if (err) return ReE(res, err, 422);
          return ReS(res, { records });
        case 'Yesterday':
          const yesterday = moment.utc().subtract(1, 'day');
          [err, records] = await to(Earned.findAll({
            include: {
              model: EarnedCategory
            },
            where: {
              created: {
                [Op.between]: [
                  moment.utc(yesterday).format('YYYY-MM-DD 00:00:00'),
                  moment.utc(yesterday).format('YYYY-MM-DD 23:59:59'),
                ],
              },
              userId: req.user.id,
            },
            order: [
              ['created', 'DESC'],
            ],
          }));
          if (records) {
            records.forEach((x) => {
              x.dataValues.category = x.dataValues.earnedcategory.name;
            });
          }
          if (err) return ReE(res, err, 422);
          return ReS(res, { records });
        case 'This week':
          const currentDate = moment().utc();
          const startDate = currentDate.clone().startOf('isoWeek');
          const endDate = currentDate.clone().endOf('isoWeek');
          [err, records] = await to(Earned.findAll({
            include: {
              model: EarnedCategory
            },
            where: {
              created: {
                [Op.between]: [
                  moment.utc(startDate).format('YYYY-MM-DD 00:00:00'),
                  moment.utc(endDate).format('YYYY-MM-DD 23:59:59'),
                ],
              },
              userId: req.user.id,
            },
            order: [
              ['created', 'DESC'],
            ],
          }));
          if (records) {
            records.forEach((x) => {
              x.dataValues.category = x.dataValues.earnedcategory.name;
            });
          }
          if (err) return ReE(res, err, 422);
          return ReS(res, { records });
        case 'This month':
          const date = moment().utc();
          const monthStart = date.clone().startOf('month').utc();
          const monthEnd = date.clone().endOf('month').utc();
          [err, records] = await to(Earned.findAll({
            include: {
              model: EarnedCategory
            },
            where: {
              created: {
                [Op.between]: [
                  moment.utc(monthStart).format('YYYY-MM-DD 00:00:00'),
                  moment.utc(monthEnd).format('YYYY-MM-DD 23:59:59'),
                ],
              },
              userId: req.user.id,
            },
            order: [
              ['created', 'DESC'],
            ],
          }));
          if (records) {
            records.forEach((x) => {
              x.dataValues.category = x.dataValues.earnedcategory.name;
            });
          }
          if (err) return ReE(res, err, 422);
          return ReS(res, { records });
      }
    }
  }
}
module.exports.dateFilter = dateFilter;

const categoryBudget = async function (req, res) {
  let err;
  let body = req.body;
  let expense = [];
  let firstDay = moment.utc().startOf('month');
  let today = moment.utc().startOf('day');
  [err, categories] = await to(Categories.findAll({
    where: {
      [Op.or]: [{ userId: null }, { userId: req.user.id }],
    },
    include: [{
      required: false,
      model: Expense,
      where: {
        userId: req.user.id,
        created: {
          [Op.between]: [
            moment.utc(firstDay).format('YYYY-MM-DD 00:00:00'),
            moment.utc(today).format('YYYY-MM-DD 23:59:59')
          ],
        },
      }
    }],
    order: [['id']]
  }));
  if (err) return ReE(res, err, 422);
  if (categories) {
    let amount = 0;
    for (let i = 0; i < categories.length; i++) {
      for (let j = 0; j < categories[i].dataValues.expenses.length; j++) {
        amount += categories[i].dataValues.expenses[j].dataValues.amount;
      };
      expense.push({
        id: categories[i].dataValues.id,
        userId: categories[i].dataValues.userId,
        name: categories[i].dataValues.name,
        icon: categories[i].dataValues.icon,
        color: categories[i].dataValues.color,
        amount: amount,
      });
      amount = 0;
      [err, budget] = await to(Budget.findOne({
        where: {
          [Op.and]: [{ categoryId: categories[i].dataValues.id }, {
            [Op.or]: [{ userId: req.user.id }, { userId: null }]
          }],
        }
      }));
      if (budget !== null) {
        expense[i].limit = budget.dataValues.limit ? budget.dataValues.limit : 0;
        expense[i].budgetId = budget.dataValues.id;
      } else {
        expense[i].limit = null;
      }
    };
  }
  return ReS(res, { expense });
}
module.exports.categoryBudget = categoryBudget;

const recentTransactions = async function (req, res) {
  let err;
  let transactions;
  let sortedTransactions = [];
  const start = moment.utc().subtract(15, 'days');
  const end = moment().utc();
  [err, recentExpense] = await to(Expense.findAll({
    include: {
      model: Categories,
      attributes: ['name', 'icon', 'color'],
    },
    where: {
      created: {
        [Op.between]: [
          moment.utc(start).format('YYYY-MM-DD 00:00:00'),
          moment.utc(end).format('YYYY-MM-DD 23:59:59')
        ]
      },
      userId: req.user.id
    },
  }));
  [err, recentEarnings] = await to(Earned.findAll({
    include: [{
      model: EarnedCategory,
      attributes: ['name'],
    }],
    where: {
      created: {
        [Op.between]: [
          moment.utc(start).format('YYYY-MM-DD 00:00:00'),
          moment.utc(end).format('YYYY-MM-DD 23:59:59')
        ]
      },
      userId: req.user.id
    },
  }));
  if (recentExpense && recentEarnings) {
    transactions = recentExpense.concat(recentEarnings);
    transactions.forEach((x) => {
      sortedTransactions.push(x.dataValues);
    });
    transactions = commonService.sortDate(sortedTransactions, 'created');
  }
  if (err) return ReE(res, err, 422);
  return ReS(res, { transactions });
}
module.exports.recentTransactions = recentTransactions;