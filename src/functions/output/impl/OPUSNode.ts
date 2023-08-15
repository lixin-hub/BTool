import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class OPUSNode extends OutPutNode {
    getExecArgs(): string[] {
        return['-i', 'input.wav', '-c:a', 'libopus', '-b:a', '128k', '-f', 'opus',this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
    getExection(): string {
        return 'opus'
    }
}