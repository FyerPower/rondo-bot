"use strict";

class Utilities {
    safeDeleteMessage(message, timer){
        if(!timer)
            timer = 100;
        setTimeout(() => {
            message.delete();
        }, timer);
    }

    minutesToMs(minutes){
        return minutes * 60 * 1000;
    }

    secondsToMs(seconds){
        return seconds * 1000;
    }
}

exports.Utilities = new Utilities();
