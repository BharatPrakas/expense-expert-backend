const moment = require('moment');
const { Op } = require("sequelize");
const announcementstatus = require('../models/announcementstatus');
const Announcement = require('../models').announcement;
const AnnouncementStatus = require('../models').announcementstatus;

const createAnnouncement = async function (req, res) {
  let err;
  let body = req.body;
  [err, announcement] = await to(Announcement.create(body));
  if (err) return ReE(res, err, 422);
  if (announcement) {
    const id = announcement.dataValues.id;
    [err, announcement] = await to(AnnouncementStatus.create({ announcementId: id }));
  }
  return ReS(res, { announcement });
}
module.exports.createAnnouncement = createAnnouncement;

const getAnnouncement = async function (req, res) {
  let err;
  let body = req.body;
  [err, announcements] = await to(Announcement.findAll({
    order: [
      ['created', 'DESC'],
    ]
  }));
  if (err) return ReE(res, err, 422);
  return ReS(res, { announcements });
}
module.exports.getAnnouncement = getAnnouncement;

const getViewedAnnouncement = async function (req, res) {
  let err;
  let body = req.body;
  [err, announcements] = await to(AnnouncementStatus.findAll());
  if (announcements) {
    announcements.forEach((item) => {
      if (item.userId) {
        item.userId = item.userId.split(',');
      } else {
        item.userId = [];
      }
    })
  }
  if (err) return ReE(res, err, 422);
  return ReS(res, { announcements });
}
module.exports.getViewedAnnouncement = getViewedAnnouncement;

const updateViewedAnnouncement = async function (req, res) {
  let err;
  let body = req.body;
  let updatedUser;
  let viewed;
  [err, announcement] = await to(AnnouncementStatus.findOne({
    where: { announcementId: body.announcementId }
  }));
  if (announcement && announcement.userId) {
    const viewedUser = announcement.dataValues.userId.split(',');
    viewedUser.push(body.userId);
    updatedUser = { userId: viewedUser.join(',') }
    console.log(updatedUser);
  } else {
    [err, viewed] = await to(AnnouncementStatus.update(body, {
      where: { announcementId: body.announcementId }
    }));
  }
  if (updatedUser) {
    [err, viewed] = await to(AnnouncementStatus.update(updatedUser, {
      where: { announcementId: body.announcementId }
    }));
  }
  if (err) return ReE(res, err, 422);
  return ReS(res, { viewed });
}
module.exports.updateViewedAnnouncement = updateViewedAnnouncement;