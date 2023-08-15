import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class MMFNode extends OutPutNode {
    getExecArgs(): string[] {
            return ['-i', 'input.wav', '-c:a', 'adpcm_ima_mmf', this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
  getExection(): string {
      return 'mmf'
  }
}