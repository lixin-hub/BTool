import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class WMANode extends OutPutNode {
    getExecArgs(): string[] {
        return['-i', 'input.wav', '-c:a', 'wmav2',this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
    getExection(): string {
        return 'wma'
    }
}