/**
 * Created by mac on 2016/11/22.
 */
//suit:0 ＝ 筒，1＝索， 2＝万，3＝字牌，
//rank:筒索万：0〜8:表示1~9，字牌0:东，1:南，2:西，3:北，4:中，5:发，6:白，
//privatePoint:0〜8:表示1~9筒；9〜17:表示1〜9索；18〜26:1〜9万；27〜33:东南西北发中白
/**
 * 一张麻将牌
 * suit:0 ＝ 筒，1＝索， 2＝万，3＝字牌，
 * rank:筒索万：0〜8:表示1~9，字牌0:东，1:南，2:西，3:北，4:中，5:发，6:白，
 * privatePoint:0〜8:表示1~9筒；9〜17:表示1〜9索；18〜26:1〜9万；27〜33:东南西北中发白
 */
const ModelUtil = require('./ModelUtil');
const SAFE = ModelUtil.SAFE;
CARDTYPE = {
    CARDTYPE_TONGZI: 0, //筒子
    CARDTYPE_TIAOZI: 1, //条子
    CARDTYPE_SUOZI: 1, //索子
    CARDTYPE_WANZI: 2, //万子
    CARDTYPE_ZIPAI: 3 //字牌
}

CARDID = {
    CARDID_TONG1: 0, //1筒
    CARDID_TONG2: 1, //2筒
    CARDID_TONG3: 2, //3筒
    CARDID_TONG4: 3, //4筒
    CARDID_TONG5: 4, //5筒
    CARDID_TONG6: 5, //6筒
    CARDID_TONG7: 6, //7筒
    CARDID_TONG8: 7, //8筒
    CARDID_TONG9: 8, //9筒

    CARDID_TIAO1: 9, //1条
    CARDID_TIAO2: 10, //2条
    CARDID_TIAO3: 11, //3条
    CARDID_TIAO4: 12, //4条
    CARDID_TIAO5: 13, //5条
    CARDID_TIAO6: 14, //6条
    CARDID_TIAO7: 15, //7条
    CARDID_TIAO8: 16, //8条
    CARDID_TIAO9: 17, //9条

    CARDID_WAN1: 18, //1万
    CARDID_WAN2: 19, //2万
    CARDID_WAN3: 20, //3万
    CARDID_WAN4: 21, //4万
    CARDID_WAN5: 22, //5万
    CARDID_WAN6: 23, //6万
    CARDID_WAN7: 24, //7万
    CARDID_WAN8: 25, //8万
    CARDID_WAN9: 26, //9万

    CARDID_DONG: 27, //东风
    CARDID_NAN: 28, //南风
    CARDID_XI: 29, //西风
    CARDID_BEI: 30, //北万


    CARDID_ZHONG: 31, //中
    CARDID_FA: 32, //发
    CARDID_BAI: 33 //白
}

/**
 * @class Card
 * 表示一张牌，使用int privatePoint唯一标识某张牌。
 * 
 */
class Card {
    constructor(opts = {}) {
        this.privatePoint = SAFE(opts.privatePoint, 0);//实际大小
        this.suit = SAFE(opts.suit, 0);//花色，指筒子:0，万子:2，条子:1或者字牌:3
        this.isGhost = SAFE(opts.isGhost, 0);//是否鬼牌,鬼牌可变成任意的牌
        this.rank = Math.floor(this.privatePoint / 9);//牌面大小
        this._setRank();
        this._setSuit();
        this._initDisplayName();
    }


    //
	/**
	 * initWithPrivatePoint
	 * 使用PrivatePoint初始化， 0~33分别代表34种不同的牌，0:1筒, 9:1条, 18:1万,27〜33:东南西北发中白
	 * 这里并没有指定是不是鬼牌
	 * @param {Int} point privatePoint
	 * @param {ArrayInt} ghostPointList 鬼牌点数数组 ex:[31,32,33]
	 * @return {void} 没有返回值
	 */
    initWithPrivatePoint(point, ghostPointList) {
        if (point < 0 || point > 34) {
            if (point < 0) {
                point = 0;
            }

            if (point > 34) {
                point = 34;
            }
        }

        this.privatePoint = point;
        this._setRank();
        this._setSuit();
        this.setIsGhost(ghostPointList);
        this._initDisplayName();

    }

    /**
     * 设定该牌是否鬼牌,如果该牌的点数在鬼牌列表中，那么就设定为true;
     * @param {*} ghostPointList 鬼牌的点数列表 ex:[31,32,33]
     */
    setIsGhost(ghostPointList) {
        for (let i in ghostPointList) {
            if (this.privatePoint == ghostPointList[i]) {
                this.isGhost = 1;
            }
        }
    }
	/**
	 * setIsGhost
	 * 指定这张牌是否为鬼牌
	 * @param{int} isGhost 是否为鬼牌
	 * @return {void} 没有返回值
	 */
    // Card.prototype.setIsGhost = function(isGhost) {
    // 	this.isGhost = isGhost;
    // }


	/**
	 * initDisplayName
	 * 初始化displayName
	 * @return {void} 没有返回值
	 * @api private
	 */
    _initDisplayName() {
        let displayNameList = ['1筒', '2筒', '3筒', '4筒', '5筒', '6筒', '7筒', '8筒', '9筒', '1条', '2条', '3条', '4条', '5条', '6条', '7条', '8条', '9条', '1万', '2万', '3万', '4万', '5万', '6万', '7万', '8万', '9万', '东', '南', '西', '北', '中', '发', '白'];
        this.displayName = displayNameList[this.privatePoint];
    }

	/**
	 * setSuit
	 * 点数
	 * @return {void} 没有返回值
	 * @api private
	 */
    _setSuit() {
        this.suit = Math.floor(this.privatePoint / 9);
    }


	/**
	 * setRank
	 * 花色
	 * @return {void} 没有返回值
	 * @api private
	 */
    _setRank() {
        this.rank = Math.floor(this.privatePoint % 9);
    }


    /**
     * 获取这张牌的下一张牌的privatePoint，比如9万，下一张牌为1万； 比如东，下一张牌为南
     * @returns {int} privatePoint
     */
    getNextPoint() {
        if (this.suit <= CARDTYPE.CARDTYPE_WANZI) {
            return this.suit * 9 + (this.rank + 1) % 9;
        } else if (this.suit === CARDTYPE.CARDTYPE_ZIPAI) {
            return this.suit * 9 + (this.rank + 1) % 7;
        }
        return 0;
    }

    /**
     * 获取这张牌的下一张牌的Card实例
     * @returns {Card} card对象
     */
    getNextCard() {
        let nextPoint = this.getNextPoint();
        return Card.CreateCardWithPoint(nextPoint);
    }

    /**
     * int数组转card对象列表
     * @param {IntArray} cardPoints
     * @param {IntArray} ghostCards 鬼牌的privatePoint 列表
     * @returns {Array}
     * 
     */
    static CreateCardsWithPointList(cardPoints, ghostCards = []) {
        let cardsList = [];
        if (cardPoints && cardPoints.length > 0) {
            for (let i in cardPoints) {
                let card = new Card();
                card.initWithPrivatePoint(parseInt(cardPoints[i]), ghostCards);
                cardsList.push(card);
            }
            cardsList = ModelUtil.sort(cardsList);
        }
        return cardsList;
    };

    /**
     * 根据展示的牌名列表，来创建牌
     * @param {ArrayString} otherNameList 需要创建的牌名数组
     * @param {ArrayInt} ghostPointList 鬼牌数组
     */
    static CreateCardWithNameList(otherNameList,ghostPointList = []){
        //根据牌名获取点数，然后根据点数创建牌
        let displayNameList = ['1筒', '2筒', '3筒', '4筒', '5筒', '6筒', '7筒', '8筒', '9筒', '1条', '2条', '3条', '4条', '5条', '6条', '7条', '8条', '9条', '1万', '2万', '3万', '4万', '5万', '6万', '7万', '8万', '9万', '东', '南', '西', '北', '中', '发', '白'];
        
        let indexList = otherNameList.map( (displayName) =>{
            return displayNameList.indexOf(displayName);
        })
        //去掉无效的牌名，比如十筒
        indexList = indexList.filter( (index) =>{
            return index != -1;
        })
        return Card.CreateCardsWithPointList(indexList,ghostPointList)
    }

    /**
     * 根据牌名创建一张牌
     * @param {String} displayName 
     * @param {ArrayInt} ghostPointList 
     */
    static CreateOneCardWithName(displayName,ghostPointList = []){
        let list = Card.CreateCardWithNameList([displayName],ghostPointList);
        return list[0];
    }

    /**
     * 
     * @param {int} privatePoint point {0~33}
     * @param {BOOL} isGhost 是否标志为鬼牌
     * @returns {Card} card对象
     */
    static CreateCardWithPoint(privatePoint,isGhost = false) {
        let currentCard = new Card();
        let ghostList = [];
        if(isGhost){
            ghostList.push(privatePoint);
        }
        currentCard.initWithPrivatePoint(parseInt(privatePoint),ghostList);
        return currentCard;
    }

}
module.exports = Card;


//胡牌测试用例
function testSpecialCardEx(i, mahjong) {

    let testPaiList = [
        ["1万", "3万", "5万", "6万", "7万", "8筒", "8筒", "6筒", "6筒", "4筒", "4筒", "中", "中"],
        ["5万", "6万", "4万", "9筒", "9筒", "8筒", "1条", "6筒", "2条", "3条", "南", "南", "中"], //7筒
        ["1万", "3万", "4万", "5万", "6万", "2筒", "3筒", "4筒", "5筒", "7筒", "南", "中", "中"], //南
        ["1万", "3万", "4万", "5万", "6万", "2筒", "3筒", "4筒", "5筒", "7筒", "中", "中", "中"], //8万
        ["2筒", "4筒", "5筒", "6筒", "7筒", "2万", "4万", "5万", "7万", "8万", "8万", "中", "白"], //3万

        ["6筒", "6筒", "1条", "3条", "4条", "5条", "6条", "7条", "9条", "7万", "9万", "中", "白"], //中
        ["3筒", "4筒", "5筒", "5筒", "6筒", "7筒", "3条", "4条", "8条", "8条", "3万", "5万", "白"], //4万
        ["9筒", "9筒", "6条", "7条", "8条", "3万", "3万", "4万", "6万", "7万", "7万", "7万", "白"], //3万
        ["1筒", "2筒", "3筒", "4筒", "5筒", "6筒", "2万", "5万", "7万", "8万", "中", "中", "白"], //4万
        ["2筒", "3筒", "4筒", "7筒", "8筒", "5条", "6条", "7条", "9条", "9条", "7万", "7万", "白"], //中

        ["5筒", "1条", "2条", "3条", "6条", "7条", "8条", "6万", "7万", "7万", "8万", "9万", "白"], //5万
        ["1筒", "2筒", "3筒", "7万", "8万", "1条", "2条", "3条", "4条", "5条", "6条", "中", "白"],
        ["3筒", "4筒", "5筒", "2条", "3条", "4条", "5万", "6万", "7万", "8万", "7条", "8条", "9条"],
        ["1条", "2条", "3条", "6条", "7条", "8条", "5万", "6万", "7万", "8万", "中", "白", "9万"],
        ["1万", "2万", "3万", "9万", "4万", "5万", "6万", "7万", "8万", "5筒", "6筒", "7筒", "中"],

        ["1万", "2万", "3万", "3条", "4条", "5条", "6条", "7条", "8条", "5筒", "6筒", "7筒", "白"],
        ["1筒", "2筒", "3筒", "3万", "4万", "5万", "6万", "7万", "8万", "5筒", "6筒", "7筒", "中"],
        ["7条", "8条", "9条", "3万", "4万", "5万", "6万", "7万", "8万", "9万", "6筒", "7筒", "白"],
        ["6万", "6万", "6万", "3万", "4万", "5万", "9万", "7万", "8万", "1筒", "2筒", "3筒", "中"],
        ["5万", "5万", "1筒", "1筒", "4条", "5条", "6条", "2筒", "2筒", "3筒", "3筒", "7筒", "白"],

        ["9万", "9万", "9万", "8万", "4万", "5万", "6万", "7万", "南", "1万", "1万", "白", "中"],
        ["1万", "2万", "3万", "1筒", "4万", "5万", "6万", "7万", "8万", "5筒", "6筒", "7筒", "中"],
        ["1万", "2万", "3万", "1筒", "4万", "5万", "6万", "7万", "8万", "5筒", "6筒", "7筒", "中"],
        ["2条", "2条", "3条", "3条", "4条", "2条", "3条", "5条", "6条", "1万", "1万", "6筒", "中"],
        ["2条", "2条", "3条", "3条", "4条", "2条", "3条", "5条", "6条", "1万", "1万", "6筒", "中"],

        ["5万", "6万", "7万", "2筒", "2筒", "5条", "4条", "3条", "8万", "7万", "9万", "6万", "中"],
        ["3万", "3万", "3万", "1条", "4万", "5万", "6万", "7万", "9万", "5筒", "6筒", "1条", "中"],
        ["南", "南", "西", "西", "4万", "5万", "6万", "7万", "8万", "9万", "6筒", "4筒", "中"],
        ["2万", "3万", "4万", "8筒", "8筒", "3筒", "3筒", "4筒", "5筒", "5筒", "6筒", "7筒", "中"],
        ["8筒", "8筒", "8筒", "南", "4万", "5万", "6万", "7万", "8万", "5筒", "6筒", "7筒", "中"],

        ["4筒", "5筒", "6筒", "6条", "7条", "8条", "4万", "4万", "6万", "7万", "东", "白", "中"],
        ["2筒", "4筒", "5筒", "6筒", "7筒", "8筒", "9筒", "6万", "7万", "8筒", "发", "发", "中"],
        ["5筒", "6筒", "3万", "5万", "7万", "8万", "北", "北", "北", "发", "中", "白", "白"],
        ["6筒", "5筒", "5万", "5万", "4万", "3万", "2万", "8条", "7条", "6条", "4条", "2条", "中"],
        ["中", "中", "南", "南", "5万", "6万", "8万", "9万", "4条", "3条", "发", "发", "发"],

        ["北", "北", "6筒", "5筒", "4筒", "1万", "2万", "3万", "5条", "5条", "6条", "7条", "白"],
        ["2筒", "4筒", "5筒", "6筒", "7筒", "2万", "4万", "5万", "8万", "7万", "8万", "白", "中"],
        ["1筒", "1筒", "1筒", "2筒", "3筒", "4筒", "3条", "3条", "5条", "6条", "6万", "7万", "中"],
        ["8筒", "9筒", "7筒", "3万", "4万", "5万", "6万", "7万", "8万", "5筒", "6筒", "1条", "中"],
        ["1条", "3条", "3万", "5万", "7万", "8万", "南", "南", "南", "2条", "6万", "白", "白"],

        ["7条", "8条", "9条", "7万", "8万", "9万", "6筒", "7筒", "8筒", "9筒", "2条", "2条", "白"],
        ["3条", "3条", "3万", "3万", "4万", "4万", "5万", "2万", "1筒", "2筒", "3筒", "4筒", "中"],
        ["6条", "7条", "8条", "9条", "5条", "4条", "3条", "2条", "1条", "1条", "6筒", "7万", "白"],
        ["1条", "3条", "3万", "5万", "7万", "8万", "7万", "8万", "6万", "2条", "6万", "白", "中"],
        ["4筒", "7筒", "8筒", "9筒", "7万", "8万", "6万", "5万", "9万", "4万", "东", "白", "中"],

        ["西", "西", "1万", "2万", "3万", "8条", "8条", "6条", "6条", "5筒", "4筒", "西", "白"],
        ["东", "东", "4条", "4条", "5条", "5条", "6条", "7条", "8条", "9条", "9条", "1万", "中"],
        ["2条", "3条", "4万", "5万", "6万", "5筒", "8筒", "7筒", "发", "发", "9万", "中", "白"],
        ["8条", "8条", "3筒", "4筒", "5筒", "8万", "7万", "6万", "1万", "3万", "3万", "白", "白"],
        ["7筒", "7筒", "3条", "7条", "8条", "9条", "1万", "3万", "5万", "6万", "7万", "白", "中"],

        ["白", "白", "白", "1筒", "2筒", "3筒", "6筒", "6筒", "4万", "6万", "7万", "8万", "9万"],
        ["中", "1筒", "1筒", "2筒", "2筒", "3筒", "3筒", "5筒", "6筒", "7筒", "8筒", "8万", "8万"],
        ["中", "白", "白", "3筒", "3筒", "6筒", "7筒", "5条", "6条", "7条", "7万", "8万", "9万"],
        ["白", "4筒", "5筒", "6筒", "7筒", "1条", "1条", "1条", "3条", "4条", "5条", "7条", "7条"],
        ["白", "4筒", "4筒", "6筒", "6筒", "1条", "1条", "1条", "2条", "2条", "6万", "7万", "8万"],


        ["6筒", "6筒", "7筒", "7筒", "8筒", "8筒", "6条", "7条", "7条", "7条", "2万", "3万", "4万"],
        ["7筒", "8筒", "8筒", "9筒", "9筒", "2条", "3条", "4条", "6万", "7万", "8万", "北", "北"],
        ["中", "1条", "5筒", "4筒", "6筒", "9筒", "9筒", "2条", "3条", "4条", "2万", "3万", "4万"],
        ["3条", "3条", "5条", "5条", "7条", "8条", "8条", "9条", "9条", "6万", "7万", "8万", "白"],
        ["白", "1条", "2条", "3条", "5条", "1万", "2万", "3万", "4万", "4万", "5万", "6万", "7万"],

        ["2筒", "3筒", "4筒", "5筒", "6筒", "7筒", "9筒", "白", "2条", "3条", "4条", "2万", "2万"],
        ["中", "白", "1筒", "2筒", "2筒", "3筒", "3筒", "4筒", "2万", "2条", "7万", "8万", "9万"],
        ["中", "3筒", "1筒", "1筒", "4条", "5条", "6条", "7条", "8条", "9条", "3万", "4万", "5万"],
        ["中", "5筒", "3筒", "4筒", "6筒", "4条", "5条", "5条", "6条", "6条", "7条", "8条", "8条"],
        ["中", "9条", "5筒", "6筒", "7筒", "1条", "1条", "6条", "7条", "8条", "7万", "8万", "9万"],

        ["白", "1筒", "1筒", "2筒", "3筒", "4筒", "5筒", "6筒", "7筒", "8筒", "9筒", "2万", "3万"],
        ["中", "4筒", "2筒", "2条", "3条", "4条", "4条", "6条", "7条", "8条", "3筒", "发", "发"],
        ["中", "2筒", "3筒", "4筒", "7筒", "7筒", "8筒", "8筒", "9筒", "9筒", "3条", "6条", "6条"],
        ["中", "白", "5筒", "5筒", "7筒", "7筒", "8筒", "8筒", "8筒", "4条", "4条", "5条", "6条"],
        ["中", "2筒", "2筒", "4筒", "5筒", "6筒", "4条", "4条", "5条", "6条", "6条", "北", "北"],

        ["中", "中", "6筒", "6筒", "7筒", "8筒", "3条", "3条", "3条", "5条", "6条", "9条", "9条"],
        ["白", "白", "2筒", "2筒", "3筒", "3筒", "5筒", "6筒", "7筒", "7筒", "8筒", "2万", "2万"],
        ["中", "5条", "6条", "6条", "7条", "7条", "8条", "2万", "2万", "2万", "4万", "4万", "7万"],
        ["4筒", "4筒", "7筒", "8筒", "8筒", "9筒", "2万", "3万", "3万", "4万", "5万", "6万", "6万"],
        ["白", "2筒", "3筒", "3筒", "4筒", "4筒", "5筒", "1条", "2条", "3条", "3条", "4条", "5条"],

        ["5筒", "5筒", "1条", "2条", "3条", "3条", "4条", "1万", "2万", "2万", "3万", "3万", "7万"],
        ["中", "白", "4筒", "5筒", "6筒", "9筒", "9筒", "1条", "2条", "3条", "3条", "5条", "7条"],
        ["中", "中", "1筒", "1筒", "7筒", "8筒", "9筒", "5条", "6条", "7条", "4万", "5万", "6万"],
        ["中", "6筒", "7筒", "8筒", "1条", "1条", "1条", "3条", "3条", "3条", "4条", "5条", "6条"],
        ["4筒", "4筒", "5筒", "5筒", "5条", "5条", "5条", "7条", "7条", "1万", "1万", "1万", "2万"],

        ["中", "3筒", "4筒", "5筒", "5筒", "6筒", "7筒", "4条", "5条", "6条", "7条", "8条", "8条"],
        ["2筒", "2筒", "2筒", "3筒", "4筒", "4筒", "7筒", "7筒", "8筒", "8筒", "9筒", "9万", "9万"],
        ["中", "1筒", "1筒", "2筒", "3筒", "4筒", "5筒", "7筒", "7筒", "6条", "6条", "7条", "8条"],
        ["5筒", "6筒", "7筒", "1条", "1条", "2条", "2条", "3条", "3条", "2万", "3万", "4万", "4万"],
        ["中", "中", "1筒", "1筒", "9筒", "9筒", "5条", "5条", "2万", "2万", "5万", "6万", "7万"],

        ["中", "6筒", "6筒", "8筒", "8筒", "2条", "2条", "3条", "3条", "5万", "7万", "7万", "7万"],
        ["2筒", "3筒", "4筒", "6筒", "6筒", "6筒", "7筒", "8筒", "9筒", "4条", "5条", "6条", "6条"],
        ["中", "白", "7条", "7条", "1万", "2万", "3万", "4万", "5万", "6万", "7万", "发", "发"],
        ["中", "5筒", "6筒", "7筒", "8筒", "9筒", "9筒", "9筒", "5条", "6条", "7条", "发", "发"],
        ["2筒", "2筒", "2筒", "3筒", "4筒", "7条", "7条", "7条", "8条", "9条", "1万", "2万", "3万"],

        ["白", "7筒", "8筒", "9筒", "1条", "1条", "3条", "4条", "5条", "3万", "4万", "5万", "6万"],
        ["2筒", "3筒", "3筒", "4筒", "4筒", "5筒", "6筒", "7筒", "3条", "4条", "5条", "发", "发"],
        ["中", "中", "白", "3筒", "5筒", "5筒", "1条", "1条", "3条", "4条", "5条", "西", "西"],
        ["1条", "1条", "2条", "3条", "4条", "5条", "6条", "7条", "8条", "9条", "东", "东", "东"],
        ["中", "白", "3筒", "4筒", "5筒", "3条", "4条", "5条", "4万", "4万", "5万", "5万", "5万"],

        ["中", "中", "3筒", "4筒", "5筒", "6筒", "3条", "4条", "4条", "4条", "5条", "7万", "8万"],
        ["中", "5筒", "5筒", "2条", "3条", "4条", "1万", "2万", "3万", "3万", "4万", "8万", "8万"],
        ["白", "1筒", "1筒", "1筒", "3筒", "5筒", "6筒", "7筒", "4条", "5条", "6条", "6条", "6条"],
        ["2筒", "3筒", "3筒", "4筒", "5筒", "5筒", "6筒", "7筒", "8筒", "4万", "5万", "6万", "6万"],
        ["白", "6筒", "6筒", "4万", "9筒", "7筒", "8筒", "1万", "2万", "3万", "5万", "8万", "8万"],

        ["白", "3筒", "4筒", "5筒", "2条", "3条", "3条", "6条", "6条", "7条", "8条", "8条", "9条"],
        ["中", "2筒", "2筒", "5筒", "6筒", "7筒", "8筒", "8筒", "9筒", "9筒", "2万", "2万", "3万"],
        ["中", "白", "3筒", "3筒", "5筒", "6筒", "6条", "7条", "8条", "9条", "1万", "2万", "3万"],
        ["3筒", "3筒", "5筒", "6筒", "6筒", "6筒", "7筒", "7筒", "8筒", "8筒", "8条", "发", "发"],
        ["白", "5筒", "5筒", "5筒", "6筒", "6筒", "8筒", "8筒", "9筒", "3条", "3条", "东", "东"],

        ["中", "白", "6筒", "7筒", "3条", "4条", "5条", "6条", "6条", "7条", "7条", "8条", "8条"],
        ["中", "7筒", "8筒", "9筒", "2万", "3万", "4万", "5万", "5万", "6万", "7万", "8万", "8万"],
        ["中", "4条", "5条", "5条", "6条", "7条", "8条", "8条", "8条", "9条", "1万", "2万", "2万"],
        ["中", "4筒", "5筒", "7筒", "8筒", "8筒", "8筒", "9筒", "4万", "5万", "西", "西", "西"],
        ["白", "1筒", "1筒", "2筒", "2筒", "3筒", "4筒", "6筒", "7筒", "7筒", "8筒", "8筒", "9筒"],

        ["中", "白", "8筒", "8筒", "1条", "2条", "3条", "4条", "5条", "6条", "5万", "7万", "8万"],
        ["中", "3筒", "4筒", "5筒", "7筒", "7筒", "7筒", "5条", "6条", "7条", "5万", "6万", "7万"],
        ["中", "中", "1筒", "2筒", "5筒", "5筒", "5筒", "6万", "6万", "7万", "7万", "9万", "9万"],
        ["1筒", "1筒", "2筒", "4筒", "5筒", "6筒", "6筒", "7筒", "8筒", "9筒", "9筒", "2条", "2条"],
        ["中", "2筒", "3筒", "4筒", "6筒", "6筒", "5条", "5条", "5万", "6万", "7万", "7万", "7万"],

        ["白", "白", "6筒", "6筒", "6筒", "5条", "5条", "5条", "4万", "8万", "8万", "发", "发"],
        ["3筒", "4筒", "4筒", "4筒", "4筒", "6筒", "7筒", "7筒", "8筒", "9筒", "1万", "2万", "2万"],
        ["白", "1筒", "2筒", "3筒", "4筒", "5筒", "6筒", "4条", "5条", "6条", "7条", "8条", "9条"],
        ["3筒", "3筒", "4筒", "5筒", "5筒", "6筒", "5条", "5条", "5条", "7条", "7条", "8条", "8条"],
        ["1筒", "1筒", "2筒", "2筒", "1条", "2条", "2条", "4条", "6条", "6条", "2万", "2万", "4万"],

        ["中", "2筒", "3筒", "4筒", "5条", "6条", "7条", "8条", "8条", "8万", "8万", "9万", "9万"],
        ["2筒", "3筒", "4筒", "5筒", "5筒", "1条", "2条", "3条", "3条", "4条", "6条", "7条", "8条"],
        ["中", "2筒", "3筒", "4筒", "4筒", "6筒", "7筒", "3万", "3万", "4万", "6万", "6万", "8万"],
        ["白", "3筒", "3筒", "3筒", "5筒", "5筒", "5筒", "2条", "2条", "4条", "5条", "6条", "7条"],
        ["中", "4筒", "4筒", "5筒", "6筒", "7筒", "7筒", "8筒", "8筒", "6条", "6条", "8条", "8条"],

        ["中", "6筒", "6筒", "7筒", "8筒", "9筒", "1条", "1条", "2条", "1万", "2万", "3万", "3万"],
        ["白", "3筒", "3筒", "4筒", "5筒", "7筒", "7筒", "7筒", "8筒", "9筒", "6条", "7条", "8条"],
        ["3筒", "3筒", "6筒", "7筒", "8筒", "4条", "5条", "6条", "6条", "7条", "7条", "8条", "9条"],
        ["白", "5筒", "6筒", "7筒", "1条", "1条", "1条", "2条", "2条", "6条", "6条", "8条", "8条"],
        ["中", "白", "3筒", "3筒", "3条", "3条", "4条", "4条", "南", "西", "北", "发", "发"],

        ["9筒", "9筒", "9筒", "1条", "1条", "2条", "2条", "5万", "5万", "6万", "6万", "7万", "7万"],
        ["中", "中", "白", "2条", "3条", "4条", "6条", "6条", "1万", "2万", "3万", "6万", "7万"],
        ["中", "3筒", "3筒", "3筒", "2条", "3条", "4条", "5条", "6条", "6条", "6条", "西", "西"],
        ["中", "白", "3筒", "4筒", "5筒", "4条", "4条", "4条", "5条", "5条", "5条", "5万", "5万"],
        ["中", "1筒", "1筒", "6筒", "7筒", "8筒", "9筒", "9筒", "9筒", "4万", "5万", "6万", "7万"],

        ["中", "中", "5筒", "5筒", "6筒", "6筒", "8筒", "8筒", "8筒", "5万", "6万", "7万", "7万"],
        ["中", "白", "7筒", "8筒", "9筒", "3条", "3条", "4条", "5条", "5条", "5条", "2万", "2万"],
        ["中", "6筒", "6筒", "3条", "4条", "5条", "4万", "4万", "6万", "6万", "6万", "7万", "7万"],
        ["中", "4筒", "5筒", "5筒", "6筒", "6条", "6条", "4万", "5万", "5万", "7万", "西", "西"],
        ["白", "2筒", "3筒", "3筒", "4筒", "7筒", "8筒", "9筒", "4条", "5条", "6条", "9条", "9条"],

        ["中", "3条", "4条", "6条", "7条", "7条", "8条", "8条", "9条", "南", "南", "发", "发"],
        ["白", "白", "4筒", "5筒", "6筒", "1条", "2条", "3条", "4条", "5条", "6条", "6万", "7万"],
        ["白", "白", "3筒", "4筒", "2条", "3条", "4条", "5条", "6条", "7条", "8条", "8万", "8万"],
        ["白", "白", "2筒", "3筒", "4筒", "5筒", "2条", "2条", "3条", "3条", "北", "北", "北"],
        ["中", "3条", "4条", "5条", "7条", "7条", "1万", "1万", "2万", "2万", "3万", "4万", "4万"],

        ["中", "3筒", "3筒", "4筒", "2万", "3万", "3万", "4万", "6万", "7万", "7万", "7万", "8万"],
        ["白", "3筒", "3筒", "5筒", "5筒", "5筒", "7筒", "5条", "5条", "6条", "6条", "7条", "7条"],
        ["中", "中", "白", "2筒", "3筒", "4筒", "6筒", "7筒", "8筒", "9筒", "5条", "5条", "5条"],
        ["中", "1筒", "2筒", "3筒", "4筒", "4筒", "5筒", "5筒", "6筒", "6条", "6条", "5万", "6万"],
        ["中", "5筒", "5筒", "5筒", "6筒", "7筒", "8筒", "6条", "7条", "8条", "9条", "9条", "9条"],

        ["1筒", "2筒", "3筒", "3条", "5条", "5条", "6条", "7条", "2万", "2万", "5万", "6万", "7万"],
        ["白", "1筒", "3筒", "1筒", "2筒", "5筒", "5筒", "6筒", "7筒", "7筒", "1万", "2万", "3万"],
        ["3筒", "4筒", "5筒", "6筒", "6筒", "5条", "5条", "5条", "6条", "7条", "8条", "9条", "9条"],
        ["中", "白", "1筒", "2筒", "3筒", "4筒", "5筒", "6筒", "1条", "2条", "3条", "6万", "6万"],
        ["中", "1筒", "2筒", "3筒", "5筒", "6筒", "7筒", "6条", "7条", "7条", "7条", "8条", "9条"],

        ["中", "8筒", "8筒", "6条", "7条", "8条", "9条", "6万", "6万", "6万", "6万", "7万", "8万"],
        ["中", "白", "6筒", "7筒", "1条", "1条", "1条", "3条", "4条", "5条", "6条", "6万", "6万"],
        ["白", "2条", "3条", "4条", "5条", "2万", "3万", "4万", "5万", "5万", "7万", "8万", "9万"],
        ["1筒", "1筒", "白", "2筒", "2筒", "3筒", "4筒", "4筒", "5筒", "6筒", "2万", "3万", "4万"],
        ["中", "5筒", "6筒", "7筒", "8筒", "6条", "7条", "8条", "8条", "9条", "9条", "北", "北"],

        ["中", "中", "白", "1筒", "1筒", "9筒", "9筒", "9筒", "1条", "1条", "1条", "1万", "1万"],
        ["2筒", "2筒", "2筒", "3筒", "4筒", "6筒", "6筒", "5条", "6条", "7条", "5万", "5万", "5万"],
        ["3筒", "4筒", "5筒", "3条", "4条", "5条", "3万", "4万", "4万", "4万", "6万", "7万", "8万"],
        ["7筒", "8筒", "8筒", "9筒", "9筒", "1万", "1万", "2万", "2万", "4万", "4万", "4万", "5万"],
        ["中", "白", "3筒", "4筒", "5筒", "6筒", "4条", "4条", "2万", "3万", "4万", "4万", "5万"],

        ["白", "2筒", "3筒", "4筒", "4筒", "5筒", "5筒", "5条", "5条", "7条", "7条", "8条", "9条"],
        ["白", "5筒", "5筒", "5筒", "6筒", "7筒", "8筒", "6条", "7条", "7条", "7条", "7条", "8条"],
        ["中", "白", "2筒", "3筒", "5筒", "5筒", "5筒", "7筒", "7筒", "6万", "7万", "8万", "9万"],
        ["中", "白", "5筒", "6筒", "7筒", "9筒", "9筒", "3条", "4条", "5条", "东", "东", "东"],
        ["白", "4筒", "4筒", "5筒", "8筒", "8筒", "9筒", "9筒", "1条", "1条", "7条", "8条", "8条"],

        ["中", "白", "6条", "7条", "8条", "2万", "2万", "3万", "3万", "4万", "4万", "8万", "8万"],
        ["白", "3筒", "4筒", "5筒", "6筒", "7筒", "7筒", "8筒", "8筒", "9筒", "9筒", "3条", "3条"],
        ["中", "4条", "6筒", "3筒", "3筒", "3筒", "4筒", "5筒", "4条", "5条", "南", "南", "南"],
        ["1筒", "2筒", "3筒", "3筒", "3筒", "6筒", "7筒", "7筒", "8筒", "8筒", "6条", "7条", "8条"],
        ["中", "白", "5筒", "6筒", "7筒", "2条", "2条", "3万", "4万", "5万", "6万", "6万", "6万"],

        ["3筒", "4筒", "5筒", "1条", "2条", "3条", "7条", "8条", "3万", "4万", "5万", "5万", "5万"],
        ["白", "6筒", "6筒", "8筒", "9筒", "9筒", "9筒", "3万", "3万", "5万", "6万", "6万", "南"],
        ["中", "白", "3筒", "4筒", "5筒", "6筒", "7筒", "7筒", "2条", "2条", "2条", "7条", "7条"],
        ["白", "4筒", "5筒", "7筒", "1条", "2条", "3条", "1万", "2万", "3万", "7万", "8万", "9万"],
        ["白", "1筒", "2筒", "3筒", "5条", "6条", "6条", "7条", "7条", "8条", "8条", "发", "发"],

        ["4筒", "5筒", "5筒", "5筒", "6筒", "9筒", "9筒", "1条", "2条", "3条", "4万", "4万", "4万"],
        ["3筒", "3筒", "9筒", "2条", "2条", "5万", "6万", "7万", "7万", "8万", "8万", "9万", "9万"],
        ["中", "白", "6筒", "7筒", "8筒", "1条", "2条", "3条", "3万", "5万", "7万", "西", "西"],
        ["中", "6筒", "7筒", "7筒", "9筒", "9筒", "1万", "1万", "3万", "3万", "7万", "9万", "9万"],
        ["中", "1筒", "1筒", "1筒", "9筒", "9筒", "1条", "2条", "3条", "3万", "4万", "西", "西"],

        ["白", "白", "2条", "4条", "5条", "5条", "5条", "1万", "2万", "3万", "4万", "5万", "6万"],
        ["中", "白", "1筒", "2筒", "3筒", "4筒", "5筒", "6筒", "6条", "1万", "1万", "2万", "2万"],
        ["白", "2筒", "3筒", "3筒", "4筒", "4筒", "5筒", "5筒", "1万", "2万", "3万", "7万", "7万"],
        ["白", "9筒", "9筒", "9筒", "6条", "6条", "7条", "8条", "2万", "2万", "4万", "4万", "4万"],
        ["1筒", "2筒", "3筒", "3筒", "4筒", "4筒", "5筒", "5筒", "7筒", "7筒", "7筒", "西", "西"],

        ["白", "2筒", "3筒", "4筒", "5筒", "6筒", "4条", "4条", "3万", "4万", "5万", "6万", "7万"],
        ["中", "中", "3条", "3条", "4条", "4条", "5条", "7条", "8条", "9条", "2万", "3万", "4万"],
        ["1筒", "2筒", "3筒", "3筒", "4筒", "6筒", "6筒", "1条", "1条", "2条", "2条", "3条", "4条"],
        ["中", "3筒", "4筒", "5筒", "6筒", "1条", "1条", "6条", "7条", "8条", "2万", "3万", "4万"],
        ["白", "1条", "1条", "1条", "5条", "5条", "3万", "4万", "4万", "5万", "6万", "发", "发"],

        ["中", "白", "6筒", "6筒", "7筒", "7筒", "8筒", "8筒", "1条", "1条", "1条", "5万", "5万"],
        ["中", "白", "3筒", "3筒", "4筒", "4筒", "4筒", "6筒", "8筒", "8筒", "4条", "5条", "6条"],
        ["中", "6筒", "7筒", "8筒", "2条", "2条", "2条", "4条", "4条", "4条", "1万", "2万", "3万"],
        ["中", "中", "5筒", "6筒", "7筒", "1条", "2条", "3条", "6条", "7条", "8条", "6万", "6万"],
        ["6筒", "7筒", "7筒", "8筒", "1条", "1条", "1条", "2条", "3条", "4条", "4条", "8条", "8条"],

        ["6条", "6条", "7条", "8条", "9条", "1万", "2万", "3万", "4万", "5万", "5万", "6万", "7万"],
        ["白", "3筒", "4筒", "5筒", "6筒", "6筒", "6筒", "1条", "2条", "2条", "2条", "西", "西"],
        ["8筒", "8筒", "9筒", "9筒", "4条", "4条", "5条", "6条", "7条", "8条", "8条", "9条", "9条"],
        ["白", "2筒", "2筒", "2筒", "3筒", "4筒", "5条", "5条", "6条", "6条", "7条", "5万", "5万"],
        ["白", "1筒", "2筒", "3筒", "3筒", "5筒", "6筒", "7筒", "1条", "1条", "3条", "1万", "1万"],

        ["白", "白", "1筒", "2筒", "3筒", "3筒", "3筒", "4筒", "4筒", "5筒", "4条", "北", "北"],
        ["中", "2筒", "3筒", "4筒", "3条", "4条", "5条", "6条", "4万", "5万", "6万", "西", "西"],
        ["中", "白", "2筒", "3筒", "4筒", "6筒", "7筒", "8筒", "5条", "5条", "7条", "8条", "9条"],
        ["中", "3筒", "4筒", "5筒", "1条", "1条", "5万", "6万", "6万", "7万", "7万", "8万", "8万"],
        ["中", "8筒", "9筒", "3条", "4条", "5条", "5条", "6条", "7条", "7条", "7条", "8条", "9条"],

        ["中", "白", "4筒", "5筒", "6筒", "5条", "5条", "2万", "3万", "3万", "4万", "9万", "9万"],
        ["中", "1条", "1条", "3条", "4条", "8条", "8条", "9条", "1万", "1万", "2万", "4万", "5万"],
        ["中", "3条", "3条", "7条", "8条", "9条", "1万", "1万", "1万", "3万", "4万", "5万", "7万"],
        ["白", "1筒", "2筒", "3筒", "6筒", "7筒", "8筒", "9筒", "9筒", "1条", "2条", "8万", "9万"],
        ["中", "白", "3筒", "3筒", "4筒", "4筒", "5筒", "5筒", "6筒", "7筒", "8筒", "7万", "7万"],

        ["3筒", "3筒", "4筒", "4筒", "5筒", "1条", "1条", "3条", "3条", "5条", "5条", "南", "南"],
        ["1筒", "1筒", "3筒", "4筒", "5筒", "8筒", "8筒", "7条", "7条", "8条", "8条", "9条", "9条"],
        ["白", "6筒", "6筒", "7筒", "7筒", "7筒", "5万", "6万", "7万", "7万", "8万", "8万", "9万"],
        ["白", "2筒", "3筒", "4筒", "9筒", "9筒", "5条", "6条", "1万", "2万", "3万", "3万", "4万"],
        ["中", "4筒", "5筒", "6筒", "7筒", "7条", "7条", "7条", "1万", "2万", "3万", "3万", "3万"],

        ["中", "3万", "3筒", "4筒", "5筒", "1条", "1条", "1条", "5条", "6条", "7条", "8万", "8万"],
        ["白", "5筒", "5筒", "8筒", "8筒", "8筒", "4万", "6万", "7万", "7万", "8万", "8万", "9万"],
        ["中", "5筒", "5筒", "6筒", "6筒", "7筒", "7筒", "8筒", "8筒", "4万", "5万", "6万", "7万"],
        ["中", "1筒", "1筒", "2筒", "2筒", "3筒", "3筒", "5筒", "6筒", "7筒", "8筒", "8万", "8万"],
        ["白", "4筒", "5筒", "6筒", "7筒", "1条", "1条", "1条", "3条", "4条", "5条", "7条", "7条"],

        ["白", "4筒", "4筒", "6筒", "6筒", "1条", "1条", "1条", "2条", "2条", "6万", "7万", "8万"],
        ["白", "2条", "3条", "4条", "5条", "6条", "6条", "7条", "9条", "9条", "7万", "8万", "9万"],
        ["中", "白", "4筒", "5筒", "5筒", "6筒", "6筒", "7筒", "4条", "4条", "6条", "8条", "8条"],
        ["中", "中", "3筒", "4筒", "6筒", "7筒", "8筒", "9筒", "9筒", "4条", "5条", "6条", "7条"],
        ["中", "1筒", "2筒", "3筒", "4筒", "5筒", "6筒", "7筒", "4条", "4条", "3万", "3万", "3万"],
        ["白", "6筒", "6筒", "7筒", "7筒", "7筒", "5万", "6万", "7万", "7万", "8万", "8万", "9万"]

    ];


    let randomInt = Math.floor(Math.random() * 10000) % testPaiList.length;
    let list = [];
    list = mahjong.getMysetCards(testPaiList[randomInt]);

    if (list.length == 13) {
        return list;
    } else {

        let loopCount = 13 - list.length;
        for (; loopCount > 0; loopCount--) {
            let card = mahjong.assigningOneCard();
            list.push(card);
        }
        return list;
    }

}
module.exports = Card;
module.exports.testSpecialCardEx = testSpecialCardEx