"use strict";

class Utilities {
    safeDeleteMessage(message){
        setTimeout(() => {
            message.delete();
        }, 100);
    }
}

exports.Utilities = new Utilities();
