
var TSSprite = cc.Sprite.extend({
    pos:new TSPoint(0,0),
    iColor:0,

    CreateSprite: function(pos, color) {

        var fileName = "res/chess" + color + ".png";

        var argnum = arguments.length;
        var sprite = new TSSprite();

        sprite.pos = pos;
        sprite.iColor = color;

        if (argnum === 0) {
            if (sprite.init())
                return sprite;
            return null;
        } else if (argnum < 2) {
            /** Creates an sprite with an image filename.
             The rect used will be the size of the image.
             The offset will be (0,0).
             */
            if (sprite && sprite.initWithFile(fileName)) {
                return sprite;
            }
            return null;
        } else {
            /** Creates an sprite with an CCBatchNode and a rect
             */
            if (sprite && sprite.initWithFile(fileName, rect)) {
                return sprite;
            }
            return null;
        }
    }
});


