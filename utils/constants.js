const JUMP_TIMERS = {
  jump: 0.1 * 60e3, // jump countdown is about 15mins30seconds
  lockdown: 0.05 * 60e3, // lockdown happens 3.5 minutes before jump
  cooldown: 5 * 60e3,
};

module.exports = {
  JUMP_TIMERS,
};
