import { DocNodeData, Line, MenuNodeData, NodeType, StreamType } from '@/types';
import { EndpointOptions } from 'jsplumb';
import { defineStore } from 'pinia'
import { PubSub } from 'pubsub-ts';
let endPointOptions: Array<EndpointOptions> = [
    // {
    //     maxConnections: 1,
    //     anchor: 'Left',
    //     isSource: false,
    //     isTarget: true
    // }, 
    {
        maxConnections: 1,
        anchor: 'Right',
        isTarget: false,
        isSource: true
    }
]

const children_1: Array<MenuNodeData> = [{
    key: "1-1",
    icon: '',
    label: "音频文件输入",
    endPointOptions,
    inputType: StreamType.NONE,
    outputType: StreamType.AUDIO,
    doubleClick(e) {
        console.log("111");

    },
}, {
    key: "1-2",
    icon: '',
    label: "视频文件输入",
    endPointOptions,
    inputType: StreamType.NONE,
    outputType: StreamType.VIDEO
}, {
    key: "1-3",
    icon: '',
    label: "网络音频输入",
    endPointOptions,
    inputType: StreamType.NONE,
    outputType: StreamType.AUDIO
}, {
    type: NodeType.TYPE_INPUT,
    key: "1-4",
    icon: '',
    label: "文本输入",
    endPointOptions,
    inputType: StreamType.NONE,
    outputType: StreamType.AUDIO
}]
const children_2: Array<MenuNodeData> = [
    {
        key: "2-1",
        icon: '',
        label: "裁减",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO,
    }, {
        key: "2-2",
        icon: '',
        label: "合并",
        endPointOptions: Array<EndpointOptions>(
            {
                maxConnections: 2,
                anchor: 'Left',
            }, {
            maxConnections: 1,
            anchor: 'Right',
        }
        ),
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO,
        inputNum: 2
    },
]
const children_3: Array<MenuNodeData> = [

    {
        type: NodeType.TYPE_AUDIO_TRANS,
        key: "3-1",
        icon: '',
        label: "转为MP3",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-2",
        icon: '',
        label: "转为WAV",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-3",
        icon: '',
        label: "转为AAC",
        endPointOptions,

        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-4",
        icon: '',
        label: "转为AIFF",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-5",
        icon: '',
        label: "转为M4A",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-6",
        icon: '',
        label: "转为M4R",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-7",
        icon: '',
        label: "转为MMF",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-8",
        icon: '',
        label: "转为OGG",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-9",
        icon: '',
        label: "转为MIDI",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-10",
        icon: '',
        label: "转为OPUS",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "3-11",
        icon: '',
        label: "转为WMA",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    },
]
const children_4: Array<MenuNodeData> = [{
    key: "4-1",
    icon: '',
    label: "语音降噪",
    endPointOptions,
    inputType: StreamType.AUDIO,
    outputType: StreamType.AUDIO
}, {
    key: "4-2",
    icon: '',
    label: "回声消除",
    endPointOptions,
    inputType: StreamType.AUDIO,
    outputType: StreamType.AUDIO
}, {
    key: "4-3",
    icon: '',
    label: "文本合成语音",
    endPointOptions,
    inputType: StreamType.AUDIO,
    outputType: StreamType.AUDIO
}, {
    key: "4-4",
    icon: '',
    label: "说话人确认",
    endPointOptions,
    inputType: StreamType.AUDIO,
    outputType: StreamType.AUDIO
}, {
    key: "4-5",
    icon: '',
    label: "语音转文本",
    endPointOptions,
    inputType: StreamType.AUDIO,
    outputType: StreamType.AUDIO
}, {
    key: "4-6",
    icon: '',
    label: "文本翻译",
    endPointOptions,
    inputType: StreamType.AUDIO,
    outputType: StreamType.AUDIO
},
]
const children_5: Array<MenuNodeData> = [
    {
        key: "5-1",
        icon: '',
        label: "输出到文件",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.AUDIO
    }, {
        key: "5-2",
        icon: '',
        label: "输出到扬声器",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.SPEAKER
    }, {
        key: "5-3",
        icon: '',
        label: "输出到文本文件",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.TXT

    }, {
        key: "5-4",
        icon: '',
        label: "输出到显示器",
        endPointOptions,
        inputType: StreamType.AUDIO,
        outputType: StreamType.MONITOR
    },
]
let childrens = [children_1, children_2, children_3, children_4, children_5]
//遍历menuItems，如果children没有定义inputNum，就设置为1,maxInputNum默认为inputNum，如果定义了就不改变
childrens.forEach((children) => {
    children.forEach((c) => {
        let child = c as MenuNodeData
        if (!child.inputNum) {
            child.inputNum = 1;
        }
        if (!child.maxInputNum) {
            child.maxInputNum = child.inputNum;
        }
        if (!child.outputNum) {
            child.outputNum = 1;
        }
        if (!child.maxOutputNum) {
            child.maxOutputNum = child.inputNum;
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


export default defineStore('common', {
    state: () => {
        return {
            //菜单项
            menuItems,
            //连接线
            lineList: Array<Line>(),
            activeNode: {} as DocNodeData,
            activeLine: {} as Line,
            //添加节点事件
            addNode: (e: any, node: MenuNodeData) => {
            },
        }
    },
});