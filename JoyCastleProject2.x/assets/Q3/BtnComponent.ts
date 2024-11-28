
const { ccclass, property } = cc._decorator;

@ccclass
export default class BtnComponent extends cc.Component {

    @property(cc.Sprite)
    BtnBg: cc.Sprite = null;

    @property(cc.Node)
    DarkNode: cc.Node = null;

    protected start(): void {
        this.node.on(cc.Node.EventType.TOUCH_START, this.OnBtnTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.OnBtnTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.OnBtnTouchEnd, this);

        this.node.scale = 0;
        cc.tween(this.node)
            .to(0.3, { scale: 1 })
            .start();

    }

    private OnBtnTouchStart() {
        //变黑方法1，按钮图上盖一层黑色图片
        // this.DarkNode.active = true;
        //变黑方法2，自定义材质属性
        this.BtnBg.getMaterial(0).setProperty("Dark", true);
        cc.tween(this.BtnBg.node)
            .to(0.2, { scale: 0.8 }, { easing: "elasticOut" })
            .start();
    }

    private OnBtnTouchEnd() {
        // this.DarkNode.active = false;
        this.BtnBg.getMaterial(0).setProperty("Dark", false);
        cc.tween(this.BtnBg.node)
            .to(0.2, { scale: 1 }, { easing: "elasticOut" })
            .start();

    }
}
