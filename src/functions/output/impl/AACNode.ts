import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class AACNode extends OutPutNode {
    getExecArgs(): string[] {
        return ['-i', 'input.wav', '-c:a', 'aac', this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
    getExection(): string {
        return 'aac'
    }
}