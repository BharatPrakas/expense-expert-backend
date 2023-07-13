var express = require('express');
var router = express.Router();
const passport = require('passport');
require('./../middleware/passport')(passport);

/* GET home page. */
const UserAccountController = require('../controllers/userAccount.controller');
const UserController = require('../controllers/user.controller');
const ExpenseController = require('../controllers/expense.controller');
const EarnedController = require('../controllers/earned.controller');

router.post('/login', UserAccountController.login);
router.post('/createUser', UserController.createUser);
router.post('/getuserInfo', passport.authenticate('jwt', { session: false }), UserController.getuserInfo);
router.post('/activateUser', UserController.activateUser);
/* expense controlls */
router.get('/getCategory', passport.authenticate('jwt', { session: false }), ExpenseController.getCategory);
router.post('/getCategories', passport.authenticate('jwt', { session: false }), ExpenseController.getCategories);
router.post('/addCategory', passport.authenticate('jwt', { session: false }), ExpenseController.addCategory);
router.post('/deleteCategory', passport.authenticate('jwt', { session: false }), ExpenseController.deleteCategory);
router.post('/addExpense', passport.authenticate('jwt', { session: false }), ExpenseController.addExpense);
router.post('/getExpenses', passport.authenticate('jwt', { session: false }), ExpenseController.getExpenses);
router.post('/getExpense', passport.authenticate('jwt', { session: false }), ExpenseController.getExpense);
router.post('/todayExpenses', passport.authenticate('jwt', { session: false }), ExpenseController.todayExpenses);
router.post('/monthExpenses', passport.authenticate('jwt', { session: false }), ExpenseController.currentMonthExpense);
router.post('/categoryExpense', passport.authenticate('jwt', { session: false }), ExpenseController.categoryExpense);
router.post('/getWeeklyExpense', passport.authenticate('jwt', { session: false }), ExpenseController.getWeeklyExpense);
router.post('/getBudget', passport.authenticate('jwt', { session: false }), ExpenseController.getBudget);
router.post('/setBudget', passport.authenticate('jwt', { session: false }), ExpenseController.setBudget);
router.post('/updateBudget', passport.authenticate('jwt', { session: false }), ExpenseController.updateBudget);
router.post('/updateExpense', passport.authenticate('jwt', { session: false }), ExpenseController.updateExpense);
router.post('/deleteExpense', passport.authenticate('jwt', { session: false }), ExpenseController.deleteExpense);
router.post('/dateFilter', passport.authenticate('jwt', { session: false }), ExpenseController.dateFilter);
router.post('/categoryBudget', passport.authenticate('jwt', { session: false }), ExpenseController.categoryBudget);
/* Earnings controlls */
router.post('/createEarning', passport.authenticate('jwt', { session: false }), EarnedController.createEarning);
router.post('/getEarnings', passport.authenticate('jwt', { session: false }), EarnedController.getEarnings);
router.post('/getMonthEarning', passport.authenticate('jwt', { session: false }), EarnedController.getMonthEarning);
router.post('/updateIncome', passport.authenticate('jwt', { session: false }), EarnedController.updateIncome);
router.post('/getIncome', passport.authenticate('jwt', { session: false }), EarnedController.getIncome);
router.post('/getEarnedCategory', passport.authenticate('jwt', { session: false }), EarnedController.getEarnedCategory);
module.exports = router;
