const express = require("express");

const router = express.Router();
const {
  getLabs,
  getLabDescriptor,
  commitDescriptor,
  addLab,
  deployLab,
  statusLab,
} = require("../controllers/lab");

router.route("/").get(getLabs);
router.route("/get_descriptor").get(getLabDescriptor);
router.route("/commit_descriptor").post(commitDescriptor);
router.route("/add_lab").post(addLab);
router.route("/deploy").post(deployLab);
router.route("/status").post(statusLab);

module.exports = router;
