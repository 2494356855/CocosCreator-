

const { ccclass, property } = cc._decorator;

const colors = [
    cc.Color.RED,
    cc.Color.GREEN,
    cc.Color.BLUE,
    cc.Color.YELLOW,
    cc.Color.MAGENTA
];
@ccclass
export default class MatrixScene extends cc.Component {
    @property(cc.EditBox)
    XInput: cc.EditBox = null;

    @property(cc.EditBox)
    YInput: cc.EditBox = null;

    @property(cc.Node)
    MatrixContainer: cc.Node = null;

    private _bundle: cc.AssetManager.Bundle = null;
    private _whiteSpriteFrame: cc.SpriteFrame = null;
    private _generator: MatrixGenerator;

    onLoad() {
        this._generator = new MatrixGenerator();
        const generateButton = this.node.getChildByName("GenerateButton").getComponent(cc.Button);
        cc.assetManager.loadBundle("Q1", (err: Error, bundle: cc.AssetManager.Bundle) => {
            this._bundle = bundle;
            bundle.load("Png/white", cc.SpriteFrame, (err: Error, res: cc.SpriteFrame) => {
                this._whiteSpriteFrame = res;
                generateButton.node.on('click', this.OnGenerateMatrix, this);
            });
        });
    }

    private OnGenerateMatrix() {
        const x: number = parseFloat(this.XInput.string);
        const y: number = parseFloat(this.YInput.string);
        this._generator.GenerateMatrix(x, y);
        this.RenderMatrix();
    }

    private RenderMatrix() {
        this.MatrixContainer.removeAllChildren();

        const matrix = this._generator.GetMatrix();
        for (let i: number = 0; i < 10; i++) {
            for (let j: number = 0; j < 10; j++) {
                const block: cc.Node = new cc.Node();
                const sprite: cc.Sprite = block.addComponent(cc.Sprite);
                sprite.spriteFrame = this._whiteSpriteFrame;
                sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                block.width = 50; // 设置单个块的大小
                block.height = 50;
                block.color = colors[matrix[i][j]];
                block.setPosition(j * 55, -i * 55); // 设置位置，增加间隔
                this.MatrixContainer.addChild(block);
            }
        }
    }

    protected onDestroy(): void {
        cc.assetManager.releaseAll();
    }
}

class MatrixGenerator {
    private matrix: number[][];

    constructor() {
        this.matrix = Array.from({ length: 10 }, () => Array(10).fill(-1));
    }

    public GenerateMatrix(x: number, y: number): void {
        // (1, 1) 初始化
        this.matrix[0][0] = Math.floor(Math.random() * 5);

        for (let i: number = 0; i < 10; i++) {
            for (let j: number = 0; j < 10; j++) {
                if (i === 0 && j === 0) continue;

                const probabilities = this.CalculateProbabilities(i, j, x, y);
                // 根据概率选择颜色
                this.matrix[i][j] = this.SelectColor(probabilities);
            }
        }
    }

    private CalculateProbabilities(i: number, j: number, x: number, y: number): number[] {
        const probabilities: number[] = Array(5).fill(1 / 5); // 初始均匀概率

        const leftColor: number = j > 0 ? this.matrix[i][j - 1] : -1; // (m, n-1)
        const aboveColor: number = i > 0 ? this.matrix[i - 1][j] : -1; // (m-1, n)

        if (leftColor !== -1) {
            probabilities[leftColor] += x / 100;
        }

        if (aboveColor !== -1) {
            probabilities[aboveColor] += x / 100;
        }

        // 如果同色，则增加 Y%
        if (leftColor === aboveColor && leftColor !== -1) {
            probabilities[leftColor] += y / 100;
        }

        //求和
        const total: number = probabilities.reduce((a, b) => a + b, 0);
        // 标准化概率
        return probabilities.map(p => p / total);
    }

    private SelectColor(probabilities: number[]): number {
        const random: number = Math.random();
        let cumulative: number = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulative += probabilities[i];
            if (random < cumulative) {
                return i; // 返回颜色索引
            }
        }
        return 0; // 默认返回第一个颜色
    }

    public GetMatrix(): number[][] {
        return this.matrix;
    }
}
