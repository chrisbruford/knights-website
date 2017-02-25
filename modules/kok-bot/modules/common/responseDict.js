"use strict";
module.exports.success = () => {
    let dictionary = [
        "Your wish is my command!",
        "All done boss! :thumbsup:",
        "It is done! :ok_hand:"
    ];

    return dictionary[Math.floor(Math.random() * dictionary.length)];
}

module.exports.fail = () => {
    let dictionary = [
        "Um...sorry couldn't do that",
        "Computer says no",
        "Oops! problem... :frowning:",
        "Eeek! problems :frowning:"
    ];

    return dictionary[Math.floor(Math.random() * dictionary.length)];
}

module.exports.noParams = () => {
    let dictionary = [
        "Um...I think you are forgetting something",
        "I need more details to work on",
        "Yeah...go on!"
    ];

    return dictionary[Math.floor(Math.random() * dictionary.length)];
}

module.exports.tooManyParams = () => {
    let dictionary = [
        "Aaah...thats too many details!",
        "No need to hurry. Give me the details one by one"
    ];

    return dictionary[Math.floor(Math.random() * dictionary.length)];
}

module.exports.notACommand = () => {
    let dictionary = [
        "Um...Were you try to give me a command? If so you may be using the wrong one"
    ];

    return dictionary[Math.floor(Math.random() * dictionary.length)];
}

module.exports.botMentioned = () => {
    let dictionary = [
        "Someone called me!!",
        "I'm here :raised_hand:"
    ];

    return dictionary[Math.floor(Math.random() * dictionary.length)];
}