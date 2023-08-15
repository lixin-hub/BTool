import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class OGGNode extends OutPutNode {
    getExecArgs(): string[] {
        return ['-i', 'input.wav', '-c:a', 'libvorbis', this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
    getExection(): string {
        return 'ogg'
    }
}