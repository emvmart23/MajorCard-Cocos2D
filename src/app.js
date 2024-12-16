var scaleUp = cc.scaleTo(0.1, 0, 0.5);
var scaleDown = cc.scaleTo(0.1, 0.5, 0.5);
var delay = cc.delayTime(0.1);
var size = cc.winSize; // size by default { width: 640 , height: 960 }
var allCards = [
  "1D.png",
  "2D.png",
  "2C.png",
  "2H.png",
  "3D.png",
  "4D.png",
  "5D.png",
  "6D.png",
  "7D.png",
  "8D.png",
  "9D.png",
  "10D.png",
  "10C.png",
  "10H.png",
  "10S.png",
  "12C.png",
  "12D.png",
  "12H.png",
  "12S.png",
];

var ButtonBackground = cc.Sprite.extend({
  ctor: function (key) {
    var frame = cc.spriteFrameCache.getSpriteFrame(key);
    this._super(frame);
  },
});

var GameLayer = cc.Layer.extend({
  _scoreLabel: null,
  _buttonAnimated: null,
  _cardArr: [],
  _selectedCards: [],
  _buttonDealer: null,
  _buttonReset:null,
  _buttonBackground: null,
  _cardOfPlayer: null,
  _currentCardOfplayer: null,
  ctor: function () {
    this._super();

    cc.spriteFrameCache.addSpriteFrames(res.gamble_1);
    cc.spriteFrameCache.addSpriteFrames(res.gamble_2);

    this._selectedCards = this.getRandomCards(allCards, 5);
    var startX = size.width / 4;

    this._cardArr = this._selectedCards.map((_, i) => {
      this._buttonAnimated = new ccui.Button();
      this._buttonAnimated.loadTextures(
        "ducardrear.png",
        this._selectedCards[i],
        "",
        ccui.Widget.PLIST_TEXTURE
      );
      this._buttonAnimated.scaleX = 0.5;
      this._buttonAnimated.scaleY = 0.5;
      this._buttonAnimated.x = startX + i * 130;
      this._buttonAnimated.y = size.height / 2;
      this._buttonAnimated.setHighlighted(false);
      this._buttonAnimated.setTouchEnabled(false);
      this._buttonAnimated.addTouchEventListener(this.onTouchPlayer, this);
      this.addChild(this._buttonAnimated);
      return this._buttonAnimated;
    });

    this._buttonReset = new ccui.Button();
    var titleButton1 = new cc.LabelTTF("Reset", "Marker Felt", 60);
    this._buttonReset.loadTextures("dubwin.png", "", "", ccui.Widget.PLIST_TEXTURE);
    this._buttonReset.scaleX = 0.3;
    this._buttonReset.scaleY = 0.3;
    this._buttonReset.x = size.width / 2.2;
    this._buttonReset.y = size.height / 8;
    titleButton1.x = 165;
    titleButton1.y = 50;
    this._buttonReset.setEnabled(false);
    this._buttonReset.addChild(titleButton1);
    this._buttonReset.addTouchEventListener(this.onTouchReset, this);
    this.addChild(this._buttonReset);

    this._buttonDealer = new ccui.Button();
    var titleButton2 = new cc.LabelTTF("Dealer", "Marker Felt", 60);
    this._buttonDealer.loadTextures(
      "dubwin.png",
      "",
      "",
      ccui.Widget.PLIST_TEXTURE
    );
    this._buttonDealer.scaleX = 0.3;
    this._buttonDealer.scaleY = 0.3;
    this._buttonDealer.x = size.width / 1.6;
    this._buttonDealer.y = size.height / 8;
    titleButton2.x = 165;
    titleButton2.y = 50;
    this._buttonDealer.addChild(titleButton2);
    this._buttonDealer.addTouchEventListener(this.onTouchDealer, this);
    this.addChild(this._buttonDealer);

    this._scoreLabel = new cc.LabelTTF("Beat the Dealer", "Maker Felt", 50);
    this._scoreLabel.x = size.width / 2;
    this._scoreLabel.y = size.height / 1.2;
    this.addChild(this._scoreLabel);
  },

  onTouchDealer: function (event) {
    var currentButton = event;
    var cardOfDealer = this._cardArr[0];

    var changeTexture = cc.callFunc(function () {
      cardOfDealer.loadTextures(
        cardOfDealer._clickedFileName,
        "",
        "",
        ccui.Widget.PLIST_TEXTURE
      );
    });

    cardOfDealer.runAction(
      cc.sequence(scaleUp, scaleDown, delay, changeTexture)
    );

    this._buttonBackground = new ButtonBackground("ducardselect.png");
    this._buttonBackground.x = 120;
    this._buttonBackground.y = 200;
    cardOfDealer.addChild(this._buttonBackground);

    this._cardArr.forEach((button, i) => {
      if (i > 0) button.setTouchEnabled(true);
    });

    currentButton.setEnabled(false);
  },

  onTouchPlayer: function (event) {
    this._currentCardOfplayer = event;
    event.setHighlighted(false);

    for (let i = 1; i < this._cardArr.length; i++) {
      (function (i) {
        var delayBetweenCards = cc.delayTime(i * 0.1);
        this._cardArr[i].runAction(
          cc.sequence(
            delayBetweenCards,
            scaleUp,
            scaleDown,
            cc.callFunc(() => {
              this._cardArr[i].loadTextures(
                this._cardArr[i]._clickedFileName,
                "",
                "ducardrear.png",
                ccui.Widget.PLIST_TEXTURE
              );
            })
          )
        );
      }).call(this, i);
    }

    var cardOfDealer = this.getNumbersOfCards(
      this._cardArr[0]._clickedFileName
    );
    this._cardOfPlayer = this.getNumbersOfCards(
      this._currentCardOfplayer._clickedFileName
    );

    this._buttonBackground = new ButtonBackground("ducardselect.png");
    this._buttonBackground.x = 120;
    this._buttonBackground.y = 200;
    this._currentCardOfplayer.addChild(this._buttonBackground);

    if (cardOfDealer > this._cardOfPlayer) {
      this._scoreLabel.setString("Game over");
    } else if (cardOfDealer < this._cardOfPlayer) {
      this._scoreLabel.setString("Well done");
    } else {
      this._scoreLabel.setString("Cards are equals");
    }

    this._cardArr.forEach((button) => {
      button.setTouchEnabled(false);
    });
    this._buttonReset.setEnabled(true);
  },

  onTouchReset: function () {
    this._buttonDealer.setEnabled(true);
    this._buttonReset.setEnabled(false);
    this._selectedCards = this.getRandomCards(allCards, 5);
    this._scoreLabel.setString("Beat the Dealer");
    this._cardArr[0].removeAllChildren(true);
    this._currentCardOfplayer.removeAllChildren(true);

    this._cardArr.map((button, i) => {
      button.loadTextures(
        "ducardrear.png",
        this._selectedCards[i],
        "",
        ccui.Widget.PLIST_TEXTURE
      );
    });
  },

  getRandomCards: function (arr, n) {
    const randomCards = [];
    const usedIndices = new Set();

    for (let i = 0; randomCards.length < n; i++) {
      const r = Math.floor(Math.random() * arr.length);
      if (!usedIndices.has(r)) {
        randomCards.push(arr[r]);
        usedIndices.add(r);
      }
    }
    return randomCards;
  },

  getNumbersOfCards: function (str) {
    let numbers = "";
    for (let i = 0; i < str.length; i++) {
      if (!isNaN(str[i])) numbers += str[i];
    }
    return +numbers;
  },
});

var HelloWorldScene = cc.Scene.extend({
  onEnter: function () {
    this._super();
    var layer = new GameLayer();
    this.addChild(layer);
  },
});
