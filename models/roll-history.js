"use strict";

var _ = require('lodash');

class RollHistory {
    constructor(){
        this.history = [];
    }

    add(member, roll){
        this.history.push({member: member, roll: roll});
    }

    clear(){
        this.history = [];
    }

    highest(num){
        if(!num){
            num = 1;
        }
        return _.takeRight(_.sortBy(this.history, ['roll']), num);
    }
}

exports.RollHistory = new RollHistory();
