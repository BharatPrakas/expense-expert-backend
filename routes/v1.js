var express = require('express');
var router = express.Router();
const passport = require('passport');
require('./../middleware/passport')(passport);

/* GET home page. */
const UserAccountController = require('../controllers/userAccount.controller');
const UserController = require('../controllers/user.controller');
const ExpenseController = require('../controllers/expense.controller');
const EarnedController = require('../controllers/earned.controller');
const AnnouncementController = require('../controllers/announcement.controller');
const messageController = require('../controllers/message.controller');
const lendingController = require('../controllers/lending.controller');

/** Endpoint for restarting server for every 20mins */
router.get('/restartService', UserController.serviceRestart);

router.post('/login', UserAccountController.login);
router.post('/createUser', UserController.createUser);
router.post('/activateUser', UserController.activateUser);
router.post('/changePasswordRequest', UserController.changePasswordRequest);
router.post('/updatePassword', UserController.updatePassword);
router.post('/resendVerificationEmail', UserController.resendVerificationEmail);
router.post('/getuserInfo', passport.authenticate('jwt', { session: false }), UserController.getuserInfo);
/* expense controlls */
router.get('/getCategory', passport.authenticate('jwt', { session: false }), ExpenseController.getCategory);
// router.post('/getCategories', passport.authenticate('jwt', { session: false }), ExpenseController.getCategories);
router.post('/getCategories', passport.authenticate('jwt', { session: false }), ExpenseController.sortCategory);
router.post('/sortCategory', ExpenseController.sortCategory);
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
router.post('/recentTransactions', passport.authenticate('jwt', { session: false }), ExpenseController.recentTransactions);
/* Earnings controlls */
router.post('/createEarning', passport.authenticate('jwt', { session: false }), EarnedController.createEarning);
router.post('/getEarnings', passport.authenticate('jwt', { session: false }), EarnedController.getEarnings);
router.post('/getEarning', passport.authenticate('jwt', { session: false }), EarnedController.getEarning);
router.post('/getMonthEarning', passport.authenticate('jwt', { session: false }), EarnedController.getMonthEarning);
router.post('/updateIncome', passport.authenticate('jwt', { session: false }), EarnedController.updateIncome);
router.post('/updateEarning', passport.authenticate('jwt', { session: false }), EarnedController.updateEarning);
router.post('/deleteEarning', passport.authenticate('jwt', { session: false }), EarnedController.deleteEarning);
router.post('/getIncome', passport.authenticate('jwt', { session: false }), EarnedController.getIncome);
router.post('/getEarnedCategory', passport.authenticate('jwt', { session: false }), EarnedController.getEarnedCategory);
/**Announcement controller */
router.get('/getAnnouncement', passport.authenticate('jwt', { session: false }), AnnouncementController.getAnnouncement);
router.post('/createAnnouncement', passport.authenticate('jwt', { session: false }), AnnouncementController.createAnnouncement);
router.get('/getViewedAnnouncement', passport.authenticate('jwt', { session: false }), AnnouncementController.getViewedAnnouncement);
router.post('/updateViewedAnnouncement', passport.authenticate('jwt', { session: false }), AnnouncementController.updateViewedAnnouncement);
/** Push Notification */
router.post('/setToken', passport.authenticate('jwt', { session: false }), messageController.setToken);
router.post('/PushNotification', messageController.PushNotification);
router.post('/getToken', messageController.getToken);
/**Lending controlls */
router.post('/addPeople', passport.authenticate('jwt', { session: false }), lendingController.addPeople);
router.get('/getPeople', passport.authenticate('jwt', { session: false }), lendingController.getPeople);
router.get('/getLendings', passport.authenticate('jwt', { session: false }), lendingController.getLendings);
router.post('/addLending', passport.authenticate('jwt', { session: false }), lendingController.addLending);
router.post('/addRefund', passport.authenticate('jwt', { session: false }), lendingController.addRefund);

module.exports = router;
