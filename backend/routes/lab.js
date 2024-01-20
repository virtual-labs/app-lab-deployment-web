const express = require("express");

const router = express.Router();
const {
  getLabs,
  getLabDescriptor,
  commitDescriptor,
  addLab,
  deployLab,
  statusLab,
  addAnalytics,
  getLatestTag,
  createTag,
} = require("../controllers/lab");

router.route("/").get(getLabs);
router.route("/get_descriptor").get(getLabDescriptor);
router.route("/commit_descriptor").post(commitDescriptor);
router.route("/add_lab").post(addLab);
router.route("/deploy").post(deployLab);
router.route("/status").post(statusLab);
router.route("/add_analytics").post(addAnalytics);
router.route("/create_tag").post(createTag);
router.route("/get_latest_tag").get(getLatestTag);

module.exports = router;
