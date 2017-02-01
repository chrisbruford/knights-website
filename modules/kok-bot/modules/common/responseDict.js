"use strict";
module.exports.success = () =>{
    let dictionary = [
        "Your wish is my command!",
        "All done boss!"
    ];

    return dictionary[Math.floor(Math.random()*dictionary.length)];
}

module.exports.fail = () => { 
    let dictionary = [
        "Um....sorry couldn't do that",
        "Computer says no",
        "Oops! problem.... :(",
        "Eeek! problems :("
    ];
 
    return dictionary[Math.floor(Math.random()*dictionary.length)];
}