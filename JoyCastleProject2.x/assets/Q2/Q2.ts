// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    private _a: number[] = [10, 40, 5, 280];
    private _b: number[] = [234, 5, 2, 148, 23];
    private _v: number = 42;
    
    private CheckAdd(a: number[], b: number[], v: number) {
        for (let aValue of a) {
            for (let bValue of b) {
                if (aValue + bValue == v) {
                    return true;
                }
            }
        }

        return false;
    }

    //时间复杂度为O(n²)
}
