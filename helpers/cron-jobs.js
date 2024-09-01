const cron = require("node-cron");
const moment = require("moment-timezone");
const Announcement = require("../models/Announcement.model");
const { broadcastAnnouncement } = require("./init_firebase_admin");

const checkAndPostAnnouncements = async () => {
  try {
    const now = moment().tz("Asia/Jakarta").startOf("day").toDate();

    const announcements = await Announcement.find({
      postDate: { $lte: now },
      isPosted: false,
    });

    for (const announcement of announcements) {
      announcement.isPosted = true;
      await announcement.save();

      broadcastAnnouncement(announcement);

      console.log(`Posted announcement: ${announcement.title}`);
    }
  } catch (error) {
    console.error("Error checking announcements:", error);
  }
};

cron.schedule("* * * * * *", checkAndPostAnnouncements, {
  timezone: "Asia/Jakarta",
});

module.exports = {
  checkAndPostAnnouncements,
};
