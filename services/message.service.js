const admin = require('firebase-admin');
// Replace this with the path to your service account key JSON file
const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), });
// Function to send push notifications
const sendPushNotification = async function (messages) {
  const message = {
    tokens: messages.token,
    notification: {
      title: messages.tittle,
      body: messages.message,
    },
    link: CONFIG.hostUrl
  };
  [err, sended] = await to(admin.messaging().sendEachForMulticast(message));
  if (err) TE(err.message);
  return sended;
}
module.exports.sendPushNotification = sendPushNotification;