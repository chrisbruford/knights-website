let express = require("express");
let router = express.Router();
let { carrierJumpRequest } = require("../../modules/kok-bot/modules/companion");
let logger = require("../../modules/logger");

router.post("/jump-scheduled", (req, res) => {
  let cmdrName = req.body.cmdrName;

  if (!cmdrName) {
    res.sendStatus(400);
    logger.log(new Error("No cmdrName provided to route"));
    return;
  }

  if (!req.user) {
    res.sendStatus(403);
    logger.log(
      new Error("non-logged in user attempted to do an interdiction alert")
    );
    return;
  }

  require("../../models/user")
    .then((User) => {
      if (!User) {
        throw new Error("Fatal model error: no user model found");
      }
      return User.findOne({ username: req.user.username.toLowerCase() });
    })
    .then((user) => {
      if (!user) {
        throw new Error(`No such user found: ${req.user.username}`);
      }
      if (user.username.toLowerCase() !== cmdrName.toLowerCase()) {
        throw new Error("commander name mismatch");
      }
      let carrierJumpRequestEvent = req.body.carrierJumpRequest;
      return carrierJumpRequest.alert(user, carrierJumpRequestEvent);
    })
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      logger.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
