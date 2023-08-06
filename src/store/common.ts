import { DocNodeData, Line, MenuNodeData, NodeType, Property, StreamType } from '@/types';
import { cloneDeep } from 'lodash';
import { defineStore } from 'pinia'
import { UUID, openFileManager } from '@/util/util';
import { fileToAudioBuffer, trimAudioFromBuffer, trimAudioFromFile, convertAudioBufferToBlob, saveBlobAsFile } from '@/util/AudioUtil';
const defaultContextMenu = [
    {

        label: '复制',
        tips: 'Open',
        fn: () => {
        }
    },
    {
        label: '查看',
        tips: 'Edit',
        fn: () => {
        }
    },
    {
        label: '删除',
        tips: 'Delete',
        fn: () => {
        }
    },
    {
        label: '重命名',
        tips: 'Rename',
        fn: () => {
        }
    }
]
//默认属性
let defaultProperties: Property[] = [
    { name: 'id', label: '节点ID' },
    { name: 'label', label: '名称' },
    { name: 'type', label: '节点类型' },
    { name: 'maxInputNum', label: '最大输入' },
    { name: 'inputType', label: '输入类型' },
    { name: 'outputType', label: '输出类型' },
    { name: 'x', label: 'x坐标' },
    { name: 'y', label: 'y坐标' },
    { name: 'playload', label: '节点负载' },
]

let inputDefault = {
    id: 'id',
    x: '0',
    y: '0',
    type: NodeType.TYPE_INPUT,
    maxInputNum: 1,
    inputType: StreamType.NONE,
    outputType: StreamType.AUDIO,
    ployload: null,
    properties: defaultProperties,
    fileName: UUID(4),
    customProperties: [
        { name: "fileName", label: '文件名称', editable: true }
    ]
}
const children_1: Array<DocNodeData> = [{
    key: "1-1",
    icon: '',
    label: "音频文件输入",
    ...inputDefault,
    async doubleClick() {
        const store = useStore()
        let file = await openFileManager(".mp3")
        this.playload = file
        store.wavedata.file = file
        this.fileName = file.name
        this.file = file
        store.activeNode.file = file
        store.activeNode.fileName = file.name
    },
    exec: async function (playload: File): Promise<AudioBuffer> {
        let audioBuffeawait = await fileToAudioBuffer(playload || this.playload)
        console.log(audioBuffeawait);
        return audioBuffeawait;
    },

}, {
    key: "1-2",
    icon: '',
    label: "从视频输入",
    ...inputDefault,

}, {
    key: "1-3",
    icon: '',
    label: "网络音频输入",
    ...inputDefault

}, {
    key: "1-4",
    icon: '',
    label: "文本输入",
    ...inputDefault
}]
let processDefault = {
    id: 'id',
    x: '0',
    y: '0',
    type: NodeType.TYPE_AUDIO_PROCESS,
    inputType: StreamType.AUDIO,
    outputType: StreamType.AUDIO,
    maxInputNum: 1,
    properties: defaultProperties,

}
const children_2: Array<DocNodeData> = [
    {
        key: "2-1",
        icon: '',
        label: "裁减",
        ...processDefault,
        start: 0,//起始
        end: 20,//结束
        customProperties: [
            { name: "start", label: '起始时间', editable: true },
            { name: "end", label: '结束时间', editable: true }
        ],
        exec: async function (playload: File | AudioBuffer, start: number, end: number): Promise<AudioBuffer> {
            this.playload = playload
            return (playload instanceof File) ? await trimAudioFromFile(playload, start || this.start, end || this.end) : trimAudioFromBuffer(playload, start || this.start, end || this.end)
        },
    }, {
        key: "2-2",
        icon: '',
        label: "合并",
        ...processDefault,
        maxInputNum: 2,
        branch1: '',
        branch2: '',
        customProperties: [
            { name: "branch1", label: '分支1' },
            { name: "branch2", label: '分支2' },
        ],
    }, {
        key: "2-3",
        icon: '',
        label: "淡入",
        ...processDefault,
        start: 0,
        end: 5,
        customProperties: [
            { name: "start", label: '开始时间', editable: true },
            { name: "end", label: '结束时间', editable: true },
        ],
    }, {
        key: "2-4",
        icon: '',
        label: "淡出",
        ...processDefault,
        start: 0,
        end: 5,
        customProperties: [
            { name: "start", label: '开始时间', editable: true },
            { name: "end", label: '结束时间', editable: true },
        ],

    },
]
let transDefault = {
    id: 'id',
    x: '0',
    y: '0',
    type: NodeType.TYPE_AUDIO_TRANS,
    inputType: StreamType.AUDIO,
    outputType: StreamType.AUDIO,
    maxInputNum: 1,
    properties: defaultProperties

}
const children_3: Array<MenuNodeData> = [

    {
        key: "3-1",
        icon: '',
        label: "转为MP3",
        ...transDefault,

    }, {
        key: "3-2",
        icon: '',
        label: "转为WAV",
        ...transDefault,
    }, {
        key: "3-3",
        icon: '',
        label: "转为AAC",
        ...transDefault,
    }, {
        key: "3-4",
        icon: '',
        label: "转为AIFF",
        ...transDefault,

    }, {
        key: "3-5",
        icon: '',
        label: "转为M4A",
        ...transDefault,

    }, {
        key: "3-6",
        icon: '',
        label: "转为M4R",
        ...transDefault,

    }, {
        key: "3-7",
        icon: '',
        label: "转为MMF",
        ...transDefault,

    }, {
        key: "3-8",
        icon: '',
        label: "转为OGG",
        ...transDefault,

    }, {
        key: "3-9",
        icon: '',
        label: "转为MIDI",
        ...transDefault,

    }, {
        key: "3-10",
        icon: '',
        label: "转为OPUS",
        ...transDefault,

    }, {
        key: "3-11",
        icon: '',
        label: "转为WMA",
        ...transDefault,
    },
]
let aidDfault = {
    id: 'id',
    x: '0',
    y: '0',
    type: NodeType.TYPE_AUDIO_PROCESS,
    inputType: StreamType.AUDIO,
    outputType: StreamType.AUDIO,
    maxInputNum: 1,
    properties: defaultProperties

}

const children_4: Array<MenuNodeData> = [{
    key: "4-1",
    icon: '',
    label: "语音降噪",
    ...aidDfault
}, {
    key: "4-2",
    icon: '',
    label: "回声消除",
    ...aidDfault

}, {
    key: "4-3",
    icon: '',
    label: "文本合成语音",
    ...aidDfault

}, {
    key: "4-4",
    icon: '',
    label: "说话人确认",
    ...aidDfault

}, {
    key: "4-5",
    icon: '',
    label: "语音转文本",
    ...aidDfault

}, {
    key: "4-6",
    icon: '',
    label: "文本翻译",
    ...aidDfault

},
]
let outputDefault = {
    id: 'id',
    x: '0',
    y: '0',
    type: NodeType.TYPE_OUTPUT,
    maxOutputNum: 0,
    maxInputNum: 1,
    inputType: StreamType.AUDIO,
    outputType: StreamType.FILE,
    properties: defaultProperties,
    fileName: null,
    customProperties: [
        { name: "fileName", label: '文件名称' },
    ],

}
const children_5: Array<DocNodeData> = [
    {
        key: "5-1",
        icon: '',
        label: "输出到文件",
        ...outputDefault,
        name: UUID(10),
        exec: async function (playload: AudioBuffer, name: string) {
            let blob = await convertAudioBufferToBlob(playload);
            const store = useStore()
            store.wavedata.file = blob
            await saveBlobAsFile(blob, name || 'trimmed_audio.wav');
        }
    }, {
        key: "5-2",
        icon: '',
        label: "输出到扬声器",
        ...outputDefault,
        outputType: StreamType.SPEAKER
    }, {
        key: "5-3",
        icon: '',
        label: "输出到文本文件",
        ...outputDefault,

        outputType: StreamType.TXT

    }, {
        key: "5-4",
        icon: '',
        label: "输出到显示器",
        ...outputDefault,
        outputType: StreamType.MONITOR
    },
]
let childrens = [children_1, children_2, children_3, children_4, children_5]
//遍历menuItems，如果children没有定义inputNum，就设置为1,maxInputNum默认为inputNum，如果定义了就不改变
childrens.forEach((children) => {
    children.forEach((c) => {
        let child = c as DocNodeData
        if (child.contextMenuItems) {
            child.contextMenuItems = [...child.contextMenuItems, ...cloneDeep(defaultContextMenu)]
        } else {
            child.contextMenuItems = cloneDeep(defaultContextMenu)

        }
    })
})


const menuItems: Array<MenuNodeData> = [
    {
        key: "1",
        icon: '',
        label: "输入",
        children: children_1,
        type: NodeType.TYPE_INPUT,
    }, {
        type: NodeType.TYPE_AUDIO_PROCESS,
        key: "2",
        icon: '',
        label: "音频数据处理",
        children: children_2,
    }, {
        type: NodeType.TYPE_AUDIO_TRANS,
        key: "3",
        icon: '',
        label: "音频格式转换",
        children: children_3,
    }, {
        type: NodeType.TYPE_AUDIO_PROCESS,
        key: "4",
        icon: '',
        label: "AI处理",
        children: children_4,
    }, {
        type: NodeType.TYPE_OUTPUT,
        key: "5",
        icon: '',
        label: "输出",
        children: children_5,
    }
]


const useStore = defineStore('common', {
    state: () => {
        return {
            //菜单项
            menuItems,
            //连接线
            lineList: Array<Line>(),
            nodeList: Array<DocNodeData>(),
            activeNode: {} as DocNodeData,
            activeLine: {} as Line,
            wavedata: {//示波器数据
                file: {} as Blob
            },
            sortedNodeList: Array<DocNodeData>(),
        }
    },

});
export default useStore;