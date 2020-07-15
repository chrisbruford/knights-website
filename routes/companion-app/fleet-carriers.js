let express = require("express");
let router = express.Router();
let {
  carrierJumpRequest,
  carrierJumpCancelled,
} = require("../../modules/kok-bot/modules/companion");
let logger = require("../../modules/logger");
const FleetCarrier = require("../../models/fleet-carriers");
const User = require("../../models/user");
const { JUMP_TIMERS } = require("../../utils/constants");

const upsertFC = (searchParams, fleetCarrier) => {
  return FleetCarrier.findOneAndUpdate(
    searchParams,
    JSON.parse(JSON.stringify(fleetCarrier)),
    {
      returnOriginal: false,
      upsert: true,
    }
  );
};

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
      new Error("non-logged in user attempted to do an FC jump alert")
    );
    return;
  }

  User.then((User) => {
    if (!User) {
      throw new Error("Fatal model error: no user model found");
    }
    return User.findOne({ username: req.user.username.toLowerCase() });
  })
    .then(async (user) => {
      if (!user) {
        throw new Error(`No such user found: ${req.user.username}`);
      }
      if (user.username.toLowerCase() !== cmdrName.toLowerCase()) {
        throw new Error("commander name mismatch");
      }
      let carrierJumpRequestEvent = req.body.carrierJumpRequest;
      const timers = await carrierJumpRequest.alert(
        user,
        carrierJumpRequestEvent
      );

      return upsertFC(
        { carrierID: carrierJumpRequestEvent.CarrierID },
        {
          nextJump: new Date(Date.now() + JUMP_TIMERS.jump),
        }
      );
    })
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      logger.log(err);
      res.sendStatus(500);
    });
});

router.post("/jump-cancelled", (req, res) => {
  let cmdrName = req.body.cmdrName;

  if (!cmdrName) {
    res.sendStatus(400);
    logger.log(new Error("No cmdrName provided to route"));
    return;
  }

  if (!req.user) {
    res.sendStatus(403);
    logger.log(
      new Error("non-logged in user attempted to do a FC jump cancelled alert")
    );
    return;
  }

  User.then((User) => {
    if (!User) {
      throw new Error("Fatal model error: no user model found");
    }
    return User.findOne({ username: req.user.username.toLowerCase() });
  })
    .then(async (user) => {
      if (!user) {
        throw new Error(`No such user found: ${req.user.username}`);
      }
      if (user.username.toLowerCase() !== cmdrName.toLowerCase()) {
        throw new Error("commander name mismatch");
      }
      let carrierJumpCancelledEvent = req.body.carrierJumpCancelled;
      return Promise.all([
        carrierJumpCancelled.alert(user, carrierJumpCancelledEvent),
        upsertFC(
          { carrierID: carrierJumpCancelledEvent.CarrierID },
          {
            nextJump: null,
          }
        ),
      ]);
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
