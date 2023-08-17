//音频淡入
import { NodeOptions, } from "@/types";
import { ProcessNode } from "../ProcessNode";
import { HightlightDecorators } from "@/decorators";
import { message, notification } from "ant-design-vue";
import { FFmpegHelper } from "@/util/FFmpegHelper";
import { fileToAudioBuffer } from "@/util/AudioUtil";
// import useCommonStore from '@/store/common';
// const store = useCommonStore()
export class EaseInOutNode extends ProcessNode {
    easeInTime: number
    easeOutTime: number
    constructor(data: NodeOptions) {
        super(data)
        this.easeInTime = data.easeInTime || 2
        this.easeOutTime = data.easeOutTime || 2
        this.customProperties = [
            { name: "easeInTime", label: '淡入持续时间(秒)', editable: true },
            { name: "easeOutTime", label: '淡出持续时间(秒)', editable: true }
        ]
    }
    //双击时加载资源
    async doubleClick() {
        this.inputPlayload = this.getPreNode()
        if (!this.inputPlayload) {
            notification.warn({
                message: "无可用数据！，右键：“执行到此节点”进行数据加载", duration: 4, placement: 'bottomRight'
            })
            return
        }
        if(this.playload){
            this.getWsUnSafe()?.loadBuffer(this.playload!! as AudioBuffer)
        }else{
            notification.success({
                message: "数据已加载，右键执行可刷新！", duration: 4, placement: 'bottomRight'
            })
        }

    }

    @HightlightDecorators()
    async exec(playload?: AudioBuffer): Promise<AudioBuffer | undefined> {
        this.inputPlayload = playload || this.getPreNode()
        if (!this.inputPlayload) {
            message.error("节点无输入")
            return
        }
        return new Promise(async (resolve) => {
            let data = await FFmpegHelper.easeInOut(this.inputPlayload, this.easeInTime, this.easeOutTime)
            let blob = new Blob([(data as Uint8Array).buffer], { type: 'audio/wav' })
            let audioBuffer = await fileToAudioBuffer(blob as File)
            this.getWs().loadBuffer(audioBuffer)
            this.playload = audioBuffer
            this.outputPlayload = audioBuffer
            resolve(audioBuffer)
        })

    }
    // //淡入淡出效果实现
    // easeInAndOut(audioBuffer: AudioBuffer, easeInTime?: number, easeOutTime?: number): Promise<AudioBuffer> {
    //     return new Promise((reslove) => {

    //         const audioContext = new AudioContext();
    //         // 创建BufferSource节点
    //         const bufferSource = audioContext.createBufferSource();
    //         bufferSource.buffer = audioBuffer;

    //         // 创建GainNode
    //         const gainNode = audioContext.createGain();

    //         // 连接节点
    //         bufferSource.connect(gainNode);
    //         gainNode.connect(audioContext.destination);

    //         // 设置淡入淡出效果
    //         const fadeOutDuration = easeOutTime || 2; // 淡出时长（秒）
    //         const fadeInDuration = easeInTime || 2; // 淡入时长（秒）

    //         // 淡入效果
    //         gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    //         gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeInDuration);

    //         // 淡出效果
    //         const fadeOutStartTime = audioContext.currentTime + audioBuffer.duration - fadeOutDuration;
    //         gainNode.gain.setValueAtTime(1, fadeOutStartTime);
    //         gainNode.gain.linearRampToValueAtTime(0, fadeOutStartTime + fadeOutDuration);

    //         // // 播放音频
    //         // bufferSource.start();

    //         // 输出AudioBuffer
    //         const outputBuffer = audioContext.createBuffer(2, audioBuffer.length, audioBuffer.sampleRate);
    //         const channelData = [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)];
    //         outputBuffer.copyToChannel(channelData[0], 0);
    //         outputBuffer.copyToChannel(channelData[1], 1);
    //         reslove(outputBuffer)

    //     })

    // }

}