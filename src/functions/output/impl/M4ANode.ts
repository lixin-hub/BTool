import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class M4ANode extends OutPutNode {
    getExecArgs(): string[] {
            return ['-i', 'input.wav', '-c:a', 'aac', '-b:a', '192k', this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
  getExection(): string {
      return 'm4a'
  }
}