import { NodeOptions, } from "@/types";
import { ProcessNode } from "../ProcessNode";
import { HightlightDecorators } from "@/decorators";
import useCommonStore from '@/store/common';
import options from '@/util/WaveSurferOptions'
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { message, notification } from "ant-design-vue";
import { MyWaveSurfer } from "@/types/MyWaveSurfer";
const store = useCommonStore()
const { mregeOption, activeNode } = storeToRefs(store)
export class MerageAudioNode extends ProcessNode {
    offset1: number
    offset2: number
    inputPlayload?: AudioBuffer[] = []
    constructor(data: NodeOptions) {
        super(data)
        this.maxInputNum = 2
        this.offset1 = data.offset1 || 0
        this.offset2 = data.offset2 || 0
        this.customProperties = [
            { name: "offset1", label: '输入1起始偏移(毫秒)', editable: true },
            { name: "offset2", label: '输入2起始偏移(毫秒)', editable: true }
        ]
        // mregeOption.value.input1.width
        watch(mregeOption.value.input1, (newData) => {
            this.offset1 = this.getTimeByLength(newData.left)
            activeNode.value.offset1 = this.getTimeByLength(newData.left)
        }, { deep: true })
        watch(mregeOption.value.input2, (newData) => {
            this.offset2 = this.getTimeByLength(newData.left)
            activeNode.value.offset2 = this.getTimeByLength(newData.left)

        }, { deep: true })
        watch(activeNode, (newData) => {
            mregeOption.value.input1.left = this.getLengthByTime(newData.offset1 || this.offset1)
            mregeOption.value.input2.left = this.getLengthByTime(newData.offset2 || this.offset2)
        }, { deep: true })


    }
    activated(): void {
        this.doubleClick()
        this.showWave()
    }
    deActivated(): void {
        this.hideAllWave()
        mregeOption.value.showMergeView = false
    }
    //双击时 查看输入波形图
    async doubleClick() {
        this.inputPlayload = this.getPreNodes()
        if (this.inputPlayload.length <= 0) {
            return
        }
        this.playload = this.inputPlayload
        if (MyWaveSurfer.alowLoading)
            mregeOption.value.showMergeView = true
        //长度：时间=100px:20s=5：1
        let input1Length = this.inputPlayload[0].duration * 5
        let input2Length = this.inputPlayload[1].duration * 5
        mregeOption.value.input1.width = input1Length
        mregeOption.value.input2.width = input2Length
        notification.info({
            message: "数据加载成功，拖动滑块进行对齐，右键执行预览", duration: 3, placement: 'bottomRight'
        })

    }
    @HightlightDecorators()
    async exec(playload?: AudioBuffer[], offset1?: number, offset2?: number): Promise<AudioBuffer | undefined> {
        return new Promise(async (resolove) => {
            this.doubleClick()
            const loadedBuffer: AudioBuffer[] = (playload || this.playload) as AudioBuffer[] || []
            
            const o1 = offset1 || this.offset1
            const o2 = offset2 || this.offset2
            if (loadedBuffer.length < 2) {
                notification.warn({
                    message: "不能执行节点：" + this.id + "  因为没有可执行数据！",
                    duration: 3,
                    placement: "bottomRight"
                })
                return
            }
            let msg = message.info("正在运行，请稍候！", 0)
            options.splitChannels = undefined
            // let data = await FFmpegHelper.mergeAudio(loadedBuffer[0], loadedBuffer[1], o1, 2)
            // let blob=new Blob([(data as Uint8Array).buffer], { type: 'audio/wav' })
            // let audioBuffer= await fileToAudioBuffer(blob as File)
            let audioBuffer = await this.mergeAudioBuffers(loadedBuffer[0], loadedBuffer[1], o1, o2)
            console.log(audioBuffer);
            let ws = this.getWs()            
            await ws.loadBuffer(audioBuffer)
            this.showWave()
            // ws.ws.setOptions(options)
            msg()
            resolove(audioBuffer)
            this.outputPlayload = audioBuffer
        })
    }

    async mergeAudioBuffers(buffer1: AudioBuffer, buffer2: AudioBuffer, offset1: number, offset2: number): Promise<AudioBuffer> {
        // 计算偏移量对应的采样数
        const offsetSamples1 = Math.floor((offset1 / 1000) * buffer1.sampleRate);
        const offsetSamples2 = Math.floor((offset2 / 1000) * buffer2.sampleRate);
        // 计算输出音频的总采样数和通道数
        const totalSamples = Math.max(offsetSamples1 + buffer1.length, offsetSamples2 + buffer2.length)

        // +Math.abs(offsetSamples1-offsetSamples2);
        const numberOfChannels = Math.max(buffer1.numberOfChannels, buffer2.numberOfChannels);
        let minOffset = Math.min(offsetSamples1, offsetSamples2)
        let maxOffset = Math.max(offsetSamples1, offsetSamples2)
        let minEnd = Math.min(offsetSamples1 + buffer1.length, offsetSamples2 + buffer2.length)
        //offset谁短
        let minIndex = offsetSamples1 <= offsetSamples2 ? 1 : 2


        // 创建新的音频缓冲区
        const audioContext = new AudioContext();
        const mergedBuffer = audioContext.createBuffer(numberOfChannels, totalSamples, buffer1.sampleRate);
        // 合并音频数据
        for (let channel = 0; channel < mergedBuffer.numberOfChannels; channel++) {
            const buffer1Data = buffer1.getChannelData(channel);
            const buffer2Data = buffer2.getChannelData(channel);
            const mixedData = mergedBuffer.getChannelData(channel);

            for (let i = 0; i < mixedData.length; i++) {
                //空区间
                if (i < minOffset) {
                    mixedData[i] = 0;
                }
                // 单区间
                else if (i >= minOffset && i < maxOffset) {
                    if (minIndex == 1)
                        //i-minOffset/maxoffset 因为前面最小偏移量之前是空的
                        mixedData[i] = buffer1Data[i - minOffset]
                    else
                        mixedData[i] = buffer2Data[i - minOffset]
                }
                //重叠区间
                else if (i >= maxOffset && i < minEnd) {
                    if (minIndex == 1) {
                        mixedData[i] = (buffer1Data[i - minOffset] + buffer2Data[i - maxOffset]) / 2;
                    } else {
                        mixedData[i] = (buffer1Data[i - maxOffset] + buffer2Data[i - minOffset]) / 2;
                    }
                }
                //后单区间
                else if (i >= minEnd) {
                    if (minIndex == 1) {//输入1偏移更短
                        //输入1先完 后面的数据是输入2的
                        if (buffer1Data.length + offsetSamples1 < buffer2Data.length + offsetSamples2) {
                            mixedData[i] = buffer2Data[i - maxOffset]

                        } else {//输入2先完 后面的是输入1的
                            mixedData[i] = buffer1Data[i - minOffset]

                        }
                    } else {//输入2更短
                        //输入1先完 后面的数据是输入2的
                        if (buffer1Data.length + offsetSamples1 < buffer2Data.length + offsetSamples2) {
                            mixedData[i] = buffer2Data[i - minOffset]

                        } else {//输入2先完 后面的是输入1的
                            mixedData[i] = buffer1Data[i - maxOffset]

                        }
                    }
                }
            }
        }

        return mergedBuffer;
    }

    //ms
    getTimeByLength(len: number) {
        return (len / 5) * 1000
    }
    //px
    getLengthByTime(ms: number) {
        return (ms / 1000) * 5
    }



}