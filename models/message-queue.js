"use strict";

var _ = require('lodash');
var Logger = require("../utilities/logger.js").Logger;

class MessageQueue {
    constructor(){
        this.interval = null;
        this.messages = [];
    }

    add(channel, message, time, selfDeleteAfter){
        this.messages.push({
            channel: channel, 
            message: message, 
            time: time, 
            selfDeleteAfter: selfDeleteAfter
        });
        this.messages = _.sortBy(this.messages, ['time']);
    }

    nextMessage(){
        return this.messages[0];
    }

    remove(message) {
        this.messages = _.without(this.messages, message);
    }
}

exports.MessageQueue = new MessageQueue();
