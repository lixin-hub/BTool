import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class M4RNode extends OutPutNode {
    getExecArgs(): string[] {
            return ['-i', 'input.wav', '-c:a', 'aac', '-b:a', '128k', '-ac', '1',this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
  getExection(): string {
      return 'm4r'
  }
}