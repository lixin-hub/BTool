import { NodeOptions, } from "@/types";
import { ProcessNode } from "./ProcessNode";
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions' //导入时间轴插件
import { trimAudioFromBuffer } from "@/util/AudioUtil";
import { HightlightDecorators } from "@/decorators";
import { watch } from "vue";
import useCommonStore from '@/store/common';
import { message } from "ant-design-vue";
const store = useCommonStore()
export class CutAudioNode extends ProcessNode {
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
    //双击时默认打开选取
    async doubleClick() {
        this.inputPlayload = this.getPreNode()
        if (!this.inputPlayload) return
        let ws = this.getWs().ws
        let plugins = ws.getActivePlugins()
        //看是否存在已经注册的插件
        let wsRegions: RegionsPlugin | undefined = plugins.find(item => item instanceof RegionsPlugin) as RegionsPlugin
        if (wsRegions) {
            wsRegions.clearRegions()
            wsRegions.addRegion({
                start: this.start,
                end: this.end,
                drag: true,
                resize: true,
                color: 'rgba(145, 252, 74,0.5)',
            })
        } else {
            wsRegions = ws.registerPlugin(RegionsPlugin.create())
            wsRegions.on('region-updated', (region) => {
                console.log('Updated region', region)
                this.start = Number.parseFloat(Number(region.start).toFixed(3))
                this.end = Number.parseFloat(Number(region.end).toFixed(3))
            })
            wsRegions.addRegion({
                start: this.start,
                end: this.end,
                drag: true,
                resize: true,
                color: 'rgba(145, 252, 74,0.5)',
            })

            wsRegions.on('region-clicked', (region, e) => {
                e.stopPropagation() // prevent triggering a click on the waveform
                // activeRegion = region
                region.play()
                region.setOptions({ color: "rgba(145, 252, 74,0.5)" })
            })
            watch(store.activeNode, () => {
                wsRegions?.clearRegions()
                wsRegions?.addRegion({
                    start: this.start,
                    end: this.end,
                    drag: true,
                    resize: true,
                    color: 'rgba(145, 252, 74,0.5)',
                })

            }, { deep: true })
        }
        this.getWs().loadBuffer(this.inputPlayload)
    }

    @HightlightDecorators()
    async exec(playload?: AudioBuffer, start?: number, end?: number): Promise<AudioBuffer | undefined> {
        this.inputPlayload = playload || this.getPreNode()
        if (!this.inputPlayload) {
            message.error("节点无输入")
            return
        }
        return new Promise(async (resolve) => {
            let audioBuffer = trimAudioFromBuffer(this.inputPlayload, start || this.start, end || this.end)
            let plugins = this.getWs().ws.getActivePlugins()
            let wsRegions: RegionsPlugin | undefined = plugins.find(item => item instanceof RegionsPlugin) as RegionsPlugin
            if (wsRegions) {
                wsRegions.clearRegions()
            }
            await this.getWs().loadBuffer(audioBuffer)
            this.playload = audioBuffer
            this.outputPlayload = audioBuffer
            resolve(audioBuffer)
        })

    }


}