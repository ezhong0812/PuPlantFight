cc.dumpConfig();

var TSGameLayer = cc.Layer.extend({

    //Sys
    ws : null, //WebSocket引擎
    sprite: null,

    //GameAS
    m_pMeshPos: [[0],[0],[0],[0],[0],[0],[0],[0],[0]],
    m_pOO: new TSPoint(0,0),
    m_Map: null,
    m_Star: null,

    //Game
    m_Choose: null,
    m_SpiritPool: null,
    m_pPathSpriteList: null,
    m_MapSpr: null,
    m_pPath: null,
    m_iIndexPath: 0,
    m_iStat: 0,

    rand: function(num) {
        return parseInt(Math.random()*num);
    },

    randomBall: function(){
        var EmptyMap = [];
        for (var i = 0; i < this.m_Map.m_width * this.m_Map.m_height; i++) {
            if (this.m_Map.m_map[i] == 0) {
                var l = i / this.m_Map.m_width;
                var h = i % this.m_Map.m_height;
                EmptyMap.push([l, h]);
            }
        }

        if (EmptyMap.size() <= 0) {
            return false;
        }

        var choose = this.rand(EmptyMap.length);
        var Pos = new TSPoint(EmptyMap[choose][0], EmptyMap[choose][1]);
        var spr = TSSprite.CreateSprite(Pos, this.rand(5));

        var loc = this.m_pMeshPos[Pos.m_x][Pos.m_y];
        spr.setPosition(loc);
        this.addChild(spr);

        this.m_Map.m_map[Pos.m_x * this.m_Map.m_width + Pos.m_y] = 1;
        this.m_MapSpr[Pos.m_x][Pos.m_y] = spr;

        this.m_SpiritPool.push(spr);

        //removeBall(spr);

        return true;
    },

    random3Ball: function() {
        for (var i = 0; i < 3; i++) {
            if(!this.randomBall()) {
                return false;
            }
        }
        return true;
    },


    init:function () {
        var bRet = false;
        if (this._super()) {
            var sp = cc.Sprite.create(s_background);
            sp.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            this.addChild(sp, 0, 1000);

            var bg = cc.Sprite.create(s_board_test);
            bg.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            bg.setScale(0.5);
            this.addChild(bg, 0, 1001)

            var pR = bg.getTextureRect();
            this.m_pOO = cc.p(winSize.width/2 - pR.size.width/2, winSize.height/2 - pR.size.height/2);

            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    this.m_pMeshPos[i][j] = cc.p(this.m_pOO.x + i * 33 + 32/2, this.m_pOO.y + j * 33 + 32/2);
                }
            }



            ///Sys

            cc.MenuItemFont.setFontName("Arial");
            cc.MenuItemFont.setFontSize(26);
            var label = cc.LabelTTF.create("MainMenu", "Arial", 20);
            var back = cc.MenuItemLabel.create(label, this.onBackCallback);
            back.setScale(0.8);

            var menu = cc.Menu.create(back);
            menu.alignItemsInColumns(1);
            this.addChild(menu);

            var cp_back = back.getPosition();
            cp_back.x += 100.0;
            cp_back.y -= 210.0;
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

TSGameLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = TSGameLayer.create();
    scene.addChild(layer);
    return scene;
};
