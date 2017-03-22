"use strict";

var _ = require('lodash');
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

    round(number, places){
        if(!places || places == 0){
            return _.round(number, 0);
        } else if (_.round(number, places) == _.round(number, places - 1)){
            return this.round(number, places - 1);
        } else {
            return _.round(number, places);
        }
    }

    date(originalDate, modifyMinutes){
        var date = new Date(originalDate);
        date.setMinutes( date.getMinutes() + (modifyMinutes || 0) );
        return date;
    }
}

exports.Utilities = new Utilities();
