import { NodeOptions, } from "@/types";
import { ProcessNode } from "./ProcessNode";
import useCommonStore from '@/store/common';
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
import { findDocNodeById } from "@/util/util";
import { convertAudioBufferToBlob, trimAudioFromBuffer, trimAudioFromFile } from "@/util/AudioUtil";
import WaveSurfer from "wavesurfer.js";
import options from "@/util/WaveSurferOptions";
import WaveSurferCache from "@/util/WaveSurferCache";

const store = useCommonStore()
export class CutAudioNode extends ProcessNode {
    private isActive = false;
    start: number = 0;
    end: number = 20;
    constructor(data: NodeOptions) {
        super(data)
        this.start = data.start || this.start
        this.end = data.end || this.end
        this.customProperties = [
            { name: "start", label: '起始时间', editable: true },
            { name: "end", label: '结束时间', editable: true }
        ]
    }
    doubleClick = () => {
        console.log(this);

    }
    deActivated = () => {
        this.isActive = false
    }
    activated = async () => {
        // this.isActive = true;
        // let playload;
        // if (this.pre) {
        //     let preNodeId = this.pre[0]
        //     let node = findDocNodeById(store.nodeList, preNodeId)
        //     playload = node?.outputPlayload
        //     if (!playload) return
        // }
        // let result = await this.exec(playload, this.start, this.end)
        // if (!result || !this.isActive) return
        // store.waveSurfer?.destroy()
        // let ws = WaveSurferCache.createWaveSurfer()
        // store.waveSurfer=ws
        // const wsRegions = ws.registerPlugin(RegionsPlugin.create())
        
        // wsRegions.on('region-updated', (region) => {
        //     console.log('Updated region', region)
        // })
        // wsRegions.addRegion({
        //     start: this.start,
        //     end: this.end,
        //     color: 'rgba(145, 252, 74,0.5)',
        // })

        // wsRegions.on('region-clicked', (region, e) => {
        //     e.stopPropagation() // prevent triggering a click on the waveform
        //     // activeRegion = region
        //     region.play()
        //     region.setOptions({ color: "rgba(145, 252, 74,0.5)" })
        // })
        // let blob = await convertAudioBufferToBlob(result)
        // if (!blob && !this.isActive) return
        // ws.loadBlob(blob)
    }
    exec = async (playload?: File | AudioBuffer, start?: number, end?: number): Promise<AudioBuffer> => {

        this.inputPlayload = playload
        return (playload instanceof File) ?
            await trimAudioFromFile(this.inputPlayload, start || this.start, end || this.end) :
            trimAudioFromBuffer(this.inputPlayload, start || this.start, end || this.end)
    }
}