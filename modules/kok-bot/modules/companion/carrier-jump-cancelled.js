const broadcast = require("../broadcasts/broadcast");
const logger = require("../../../logger");
const Discord = require("discord.js");
const jumpTimers = require("./jumpTimers");

function alert(user, jumpCancelledEvent) {
  let embed = new Discord.RichEmbed();
  embed.setColor(0xff0000);
  embed.setTitle(`🚫 JUMP CANCELLED`);
  embed.addField(`Fleet Carrier`, jumpCancelledEvent.CarrierID);

  const runningTimers = jumpTimers.get(jumpCancelledEvent.CarrierID);

  if (Array.isArray(runningTimers)) {
    runningTimers.forEach((timer) => clearTimeout(timer));
    jumpTimers.delete(jumpCancelledEvent.CarrierID);
  } else {
    return Promise.reject(new Error("No timers running for this jump"));
  }

  return broadcast(user, embed).catch((err) => {
    logger.log(err);
    return Promise.reject(err);
  });
}

module.exports = {
  alert,
};
