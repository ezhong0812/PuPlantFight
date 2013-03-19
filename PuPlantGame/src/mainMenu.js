cc.dumpConfig();

var mainMenu = cc.Layer.extend({
    winSize:[],
    init:function() {
        if (this._super()) {
            this.winSize = cc.Director.getInstance().getWinSize();

        }
    }

});