import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
export class Mp3Node extends OutPutNode {
    getExecArgs(): string[] {
            return ['-i', 'input.wav' ,'-acodec' ,'libmp3lame', this.getFileName()]
    }
    constructor(data: NodeOptions) {
        super(data)
    }
  getExection(): string {
      return 'mp3'
  }
}