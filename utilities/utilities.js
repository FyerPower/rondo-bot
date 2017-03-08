"use strict";

var Logger = require("./logger.js").Logger;

class Utilities {
    safeDeleteMessage(message, timer){
        // Default timer to 100ms
        if(!timer){
            timer = 100;
        }

        Logger.log("silly", "Utility Delete Message - Message deleting in "+timer+"ms");
        setTimeout((msg) => {
            msg.delete();
        }, timer, message);
    }

    minutesToMs(minutes){
        return minutes * 60 * 1000;
    }

    secondsToMs(seconds){
        return seconds * 1000;
    }

    stringToInteger(str){
        return parseInt(str.replace(/[^0-9]/g, ''));
    }
}

exports.Utilities = new Utilities();
