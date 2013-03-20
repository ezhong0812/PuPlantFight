var TSGameLayer = cc.Layer.extend({

    ws : null, //WebSocket引擎
    sprite: null,

    init:function () {
        var bRet = false;
        if (this._super()) {
            var sp = cc.Sprite.create(s_loading);
            sp.setAnchorPoint(cc.p(0,0));
            this.addChild(sp, 0, 1);

            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(26);
            var label = cc.LabelTTF.create("Back MainMenu", "Arial", 20);
            var back = cc.MenuItemLabel.create(label, this.onBackCallback);
            back.setScale(0.8);

            var menu = cc.Menu.create(back);
            menu.alignItemsInColumns(1);
            this.addChild(menu);

            var cp_back = back.getPosition();
            cp_back.y -= 50.0;
            back.setPosition(cp_back);

            // add "Helloworld" splash screen"
            this.sprite = cc.Sprite.create(s_chess0);
            this.sprite.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            this.addChild(this.sprite, 0);

            if( 'keyboard' in sys.capabilities )
                this.setKeyboardEnabled(true);

            if( 'mouse' in sys.capabilities )
                this.setMouseEnabled(true);

            if( 'touches' in sys.capabilities )
                this.setTouchEnabled(true);

            var spr = this.sprite;
            this.ws = WebSocketEngine (
                function(jobj) {
                    var x = Number(jobj.xx);
                    var y = Number(jobj.yy);
                    spr.setPosition(cc.p(x,y));
                },
                function(jobj) {

                }
            );
            bRet = true;
        }
        return bRet;
    },

    onBackCallback:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(TSMainMenu.create());
        cc.Director.getInstance().replaceScene(cc.TransitionFade.create(1.2, scene));
    },

    onTouchesMoved:function (touches, event) {
        this.processEvent( touches[0] );
    },

    onMouseDragged:function( event ) {
        this.processEvent( event );
    },

    processEvent:function( event ) {
        var delta = event.getDelta();
        var curPos = this.sprite.getPosition();
        curPos= cc.pAdd( curPos, delta );
        curPos = cc.pClamp(curPos, cc.POINT_ZERO, cc.p(winSize.width, winSize.height) );
        this.sprite.setPosition( curPos );

        this.ws.publish("TS", curPos.x.toString(), curPos.y.toString());
    }
});

TSGameLayer.create = function () {
    var sg = new TSGameLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
