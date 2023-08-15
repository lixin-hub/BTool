import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class FLACNode extends OutPutNode {
    getExecArgs(): string[] {
            return ['-i', 'input.wav', '-c:a', 'flac',this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
  getExection(): string {
      return 'flac'
  }
}