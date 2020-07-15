const broadcast = require("../broadcasts/broadcast");
const logger = require("../../../logger");
const Discord = require("discord.js");
const { UTCTime } = require("../common/dateHelper");
const FleetCarrier = require("../../../../models/fleet-carriers");
const jumpTimers = require("./jumpTimers");

const { JUMP_TIMERS } = require("../../../../utils/constants");

function hasJumpScheduled(carrierID) {
  return FleetCarrier.findOne({ carrierID }).then((fc) => {
    return !!fc.nextJump;
  });
}

function lockdownBroadcast(user, jumpScheduledEvent) {
  const jumpTime = new Date(
    Date.now() + JUMP_TIMERS.jump - JUMP_TIMERS.lockdown
  );
  let embed = new Discord.RichEmbed();
  embed.setColor(0xfc7f03);
  embed.setTitle(`🔒 LOCKDOWN`);
  embed.addField(`Fleet Carrier`, jumpScheduledEvent.CarrierID);
  embed.addField(
    `Target system`,
    jumpScheduledEvent.SystemName.toUpperCase(),
    true
  );
  embed.addField("Target body", jumpScheduledEvent.Body, true);
  embed.setFooter(`Jump at ${UTCTime(jumpTime)} UTC`);

  broadcast(user, embed).catch((err) => {
    logger.log(err);
  });
}

function jumpBroadcast(user, jumpScheduledEvent) {
  //schedule announcement for lockdown
  let embed = new Discord.RichEmbed();
  embed.setColor(0x33b53e);
  embed.setTitle(`🌌 JUMP`);
  embed.addField(`Fleet Carrier`, jumpScheduledEvent.CarrierID);
  embed.addField(
    `Target system`,
    jumpScheduledEvent.SystemName.toUpperCase(),
    true
  );
  embed.addField("Target body", jumpScheduledEvent.Body, true);

  broadcast(user, embed).catch((err) => {
    logger.log(err);
  });
}

function alert(user, jumpScheduledEvent) {
  const now = Date.now();
  const lockdownTime = new Date(now + JUMP_TIMERS.lockdown);
  const jumpTime = new Date(now + JUMP_TIMERS.jump);

  let embed = new Discord.RichEmbed();
  embed.setColor(0xff0000);
  embed.setTitle(`🚀 JUMP SCHEDULED`);
  embed.addField(`Fleet Carrier`, jumpScheduledEvent.CarrierID);
  embed.addField(
    `Target system`,
    jumpScheduledEvent.SystemName.toUpperCase(),
    true
  );
  embed.addField("Target body", jumpScheduledEvent.Body, true);
  embed.setFooter(
    `Lockdown at ${UTCTime(lockdownTime)} UTC\nJump at ${UTCTime(jumpTime)} UTC`
  );

  jumpTimers.set(jumpScheduledEvent.CarrierID, [
    setTimeout(() => {
      if (hasJumpScheduled) {
        lockdownBroadcast(user, jumpScheduledEvent);
      }
    }, JUMP_TIMERS.lockdown),

    setTimeout(() => {
      if (hasJumpScheduled) {
        jumpBroadcast(user, jumpScheduledEvent);
      }
    }, JUMP_TIMERS.jump),
  ]);

  return broadcast(user, embed).catch((err) => {
    logger.log(err);
    return Promise.reject(err);
  });
}

module.exports = {
  alert,
};
