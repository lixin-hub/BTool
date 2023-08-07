import { NodeOptions } from "@/types";
import { OutPutNode } from "./OutputNode";
import useStore from "@/store/common";
import { convertAudioBufferToBlob, saveBlobAsFile } from "@/util/AudioUtil";

export class FileOutNode extends OutPutNode {

    constructor(data: NodeOptions) {
        super(data)
    }
    exec = async (playload: AudioBuffer, name: string) => {
        let blob = await convertAudioBufferToBlob(playload);
        this.playload = blob
        const store = useStore()
        store.wavedata.file = blob
        await saveBlobAsFile(blob, name || 'trimmed_audio.wav');
    }
}