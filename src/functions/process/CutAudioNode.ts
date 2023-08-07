import { NodeOptions, } from "@/types";
import { ProcessNode } from "./ProcessNode";

export class CutAudioNode extends ProcessNode {
    start: number = 0;
    end: number = 20;
    constructor(data: NodeOptions) {
        super(data)
        this.start = data.start || this.start
        this.end = data.end || this.end
        this.customProperties = [
            { name: "start", label: '起始时间', editable: true },
            { name: "end", label: '结束时间', editable: true }
        ]
    }
    doubleClick = () => {
        console.log(this);

    }
}