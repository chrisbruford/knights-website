"use strict";
let guildUsersModel = require('../../../../models/discord-users.js');
const client = require('../common/client');

module.exports = new Handler();

function Handler() {
    this.show = (userID, thisGuild) => {
        return new Promise((resolve, reject) => {
            let guildID = thisGuild.id;
            guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                .then(guildUsers => {
                    if (guildUsers) {
                        let duplicate = false;
                        guildUsers.users.forEach((user, index, users) => {
                            if (user.id === userID) {
                                if (!users[index].karma) {
                                    users[index].karma = 0;
                                }
                                resolve(user.karma);
                                duplicate = true;
                            }
                        });
                        if (!duplicate) {
                            guildUsers.users.push({ id: userID, karma: 0 });
                            resolve(0);
                        }
                        guildUsers.save()
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        reject(new Error("findOneOrCreate() has not returned a model"));
                    }
                })
        })
    }

    this.add = (karma, userID, thisGuild) => {
        return new Promise((resolve, reject) => {
            let guildID = thisGuild.id;
            guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                .then(guildUsers => {
                    if (guildUsers) {
                        let duplicate = false;
                        guildUsers.users.forEach((user, index, users) => {
                            if (user.id === userID) {
                                if (!users[index].karma) {
                                    users[index].karma = 0;
                                }
                                let changeKarma = parseInt(karma);
                                if (isNaN(changeKarma)) {
                                    return reject(new Error("Karma value is not a number"));
                                }
                                users[index].karma += changeKarma;
                                duplicate = true;
                            }
                        });
                        if (!duplicate) {
                            guildUsers.users.push({ id: userID, karma: karma });
                        }
                        guildUsers.save()
                            .then(guild => {
                                resolve(guild);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        reject(new Error("findOneOrCreate() has not returned a model"));
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    this.remove = (karma, userID, thisGuild) => {
        return new Promise((resolve, reject) => {
            let guildID = thisGuild.id;
            guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                .then(guildUsers => {
                    if (guildUsers) {
                        let duplicate = false;
                        guildUsers.users.forEach((user, index, users) => {
                            if (user.id === userID) {
                                if (!users[index].karma) {
                                    users[index].karma = 0;
                                }
                                let changeKarma = parseInt(karma);
                                if (isNaN(changeKarma)) {
                                    return reject(new Error("Karma value is not a number"));
                                }
                                users[index].karma -= changeKarma;
                                duplicate = true;
                            }
                        });
                        if (!duplicate) {
                            guildUsers.users.push({ id: userID, karma: -karma });
                        }
                        guildUsers.save()
                            .then(guild => {
                                resolve(guild);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        reject(new Error("findOneOrCreate() has not returned a model"));
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    this.give = (karma, fromUserID, toUserID, thisGuild) => {
        return new Promise((resolve, reject) => {
            let guildID = thisGuild.id;
            guildUsersModel.findOneOrCreate({ guildID }, { guildID })
                .then(guildUsers => {
                    if (guildUsers) {
                        let found = false;
                        guildUsers.users.forEach((user, index, users) => {
                            if (user.id === fromUserID && users[index].karma && users[index].karma >= karma) {
                                let changeKarma = parseInt(karma);
                                if (isNaN(changeKarma)) {
                                    return reject(new Error("Karma value is not a number"));
                                }
                                users[index].karma -= changeKarma;
                                found = true;
                            }
                        });
                        if (!found) {
                            return reject(new Error("Not enough karma"));
                        }
                        let duplicate = false;
                        guildUsers.users.forEach((user, index, users) => {
                            if (user.id === toUserID) {
                                if (!users[index].karma) {
                                    users[index].karma = 0;
                                }
                                let changeKarma = parseInt(karma);
                                if (isNaN(changeKarma)) {
                                    return reject(new Error("Karma value is not a number"));
                                }
                                users[index].karma += changeKarma;
                                duplicate = true;
                            }
                        });
                        if (!duplicate) {
                            guildUsers.users.push({ id: toUserID, karma: karma });
                        }
                        guildUsers.save()
                            .then(guild => {
                                resolve(guild);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        reject(new Error("findOneOrCreate() has not returned a model"));
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}