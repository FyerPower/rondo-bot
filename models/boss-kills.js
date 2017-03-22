"use strict";

var _ = require('lodash');
var Logger = require("../utilities/logger.js").Logger;

class BossKills {
    constructor(){
        this.bossKills = [];
    }

    add(boss, notes, channel, deathTime, respawnTime){
        this.clearOldKills();
        this.bossKills.push({
            boss: boss, 
            notes: notes,
            channel: channel, 
            deathTime: deathTime, 
            respawnTime: respawnTime
        });
        this.bossKills = _.sortBy(this.bossKills, ['respawnTime']);
    }

    list(){
        this.clearOldKills();
        return this.bossKills;
    }

    clear(){
        this.bossKills = [];
    }

    clearOldKills() {
        var now = new Date();
        this.bossKills = _.filter(this.bossKills, function(bk){
            return (bk.respawnTime > now);
        });
    }
}

exports.BossKills = new BossKills();
