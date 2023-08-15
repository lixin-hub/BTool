import { NodeOptions } from "@/types";
import { OutPutNode } from "../OutputNode";
import { convertAudioBufferToWavBlob, saveBlobAsFile } from "@/util/AudioUtil";
import { message } from "ant-design-vue";
import { HightlightDecorators } from "@/decorators";
export class WavNode extends OutPutNode {
    getExecArgs(): string[] {
        return ['-i','input.wav','-acodec', 'pcm_s16le', '-ar', '44100',this.getFileName()]
    }
    getExection(): string {
        return "wav"
    }

    constructor(data: NodeOptions) {
        super(data)
    }
    @HightlightDecorators()
    async exec(playload: AudioBuffer){
        this.inputPlayload = playload || this.getPreNode()
        if (!this.inputPlayload) {
            message.error("节点无输入")
            return
        }
        let blob = await convertAudioBufferToWavBlob(this.inputPlayload);
        await saveBlobAsFile(blob, this.getFileName() || 'trimmed_audio.wav');
    }
    
}