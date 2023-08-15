import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class AIFFNode extends OutPutNode {
    getExecArgs(): string[] {
            return ['-i', 'input.wav', '-c:a', 'pcm_s16be',this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
  getExection(): string {
      return 'aiff'
  }
}