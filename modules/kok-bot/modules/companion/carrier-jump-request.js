const broadcast = require("../broadcasts/broadcast");
const logger = require("../../../logger");
const Discord = require("discord.js");
const { UTCTime } = require("../common/dateHelper");

const JUMP_TIMERS = {
  jump: 15.5 * 60e3, // jump countdown is about 15mins30seconds
  lockdown: 12 * 60e3, // lockdown happens 3.5 minutes before jump
  cooldown: 5 * 60e3,
};

function lockdownBroadcast(user, jumpScheduledEvent) {
  const jumpTime = new Date(
    Date.now() + JUMP_TIMERS.jump - JUMP_TIMERS.lockdown
  );
  let lockdownEmbed = new Discord.RichEmbed();
  lockdownEmbed.setColor(0xfc7f03);
  lockdownEmbed.setTitle(`🔒 LOCKDOWN`);
  lockdownEmbed.addField(`Fleet Carrier`, jumpScheduledEvent.CarrierID);
  lockdownEmbed.addField(
    `Target system`,
    jumpScheduledEvent.SystemName.toUpperCase(),
    true
  );
  lockdownEmbed.addField("Target body", jumpScheduledEvent.Body, true);
  embed.setFooter(`Jump at ${UTCTime(jumpTime)} UTC`);

  broadcast(user, lockdownEmbed).catch((err) => {
    logger.log(err);
  });
}

function jumpBroadcast(user, jumpScheduledEvent) {
  //schedule announcement for lockdown
  let lockdownEmbed = new Discord.RichEmbed();
  lockdownEmbed.setColor(0x33b53e);
  lockdownEmbed.setTitle(`🌌 JUMP`);
  lockdownEmbed.addField(`Fleet Carrier`, jumpScheduledEvent.CarrierID);
  lockdownEmbed.addField(
    `Target system`,
    jumpScheduledEvent.SystemName.toUpperCase(),
    true
  );
  lockdownEmbed.addField("Target body", jumpScheduledEvent.Body, true);

  broadcast(user, lockdownEmbed).catch((err) => {
    logger.log(err);
  });
}

function alert(user, jumpScheduledEvent) {
  const now = new Date();
  const lockdownTime = new Date(Date.now() + JUMP_TIMERS.lockdown);
  const jumpTime = new Date(Date.now() + JUMP_TIMERS.jump);

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

  setTimeout(
    () => lockdownBroadcast(user, jumpScheduledEvent),
    JUMP_TIMERS.lockdown
  );

  setTimeout(() => jumpBroadcast(user, jumpScheduledEvent), JUMP_TIMERS.jump);

  return broadcast(user, embed).catch((err) => {
    logger.log(err);
    return Promise.reject(err);
  });
}

module.exports = {
  alert,
};
