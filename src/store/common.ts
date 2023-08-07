import { DocNodeData, Line, MenuNodeData, NodeKey } from '@/types';
import { defineStore } from 'pinia'

const menuItems: Array<MenuNodeData> = [
    {
        key: "1",
        icon: '',
        label: "输入",
        children: [{
            key: NodeKey.KEY_FILE_INPUT,
            icon: '',
            label: "音频文件输入",
        },
        {
            key: "1-2",
            icon: '',
            label: "从视频输入",
        }
            , {
            key: "1-3",
            icon: '',
            label: "网络音频输入",
        }, {
            key: "1-4",
            icon: '',
            label: "文本输入",
        }],
    }, {
        key: "2",
        icon: '',
        label: "音频数据处理",
        children: [{
            key: NodeKey.KEY_PROCESS_CUT,
            icon: '',
            label: "裁减",
        }, {
            key: "2-2",
            icon: '',
            label: "合并",

        }, {
            key: "2-3",
            icon: '',
            label: "淡入",
        }, {
            key: "2-4",
            icon: '',
            label: "淡出",
        }],
    }, {
        key: "3",
        icon: '',
        label: "音频格式转换",
        children: [
            {
                key: "3-1",
                icon: '',
                label: "转为MP3",
            }, {
                key: "3-2",
                icon: '',
                label: "转为WAV",
            }, {
                key: "3-3",
                icon: '',
                label: "转为AAC",
            }, {
                key: "3-4",
                icon: '',
                label: "转为AIFF",

            }, {
                key: "3-5",
                icon: '',
                label: "转为M4A",

            }, {
                key: "3-6",
                icon: '',
                label: "转为M4R",

            }, {
                key: "3-7",
                icon: '',
                label: "转为MMF",

            }, {
                key: "3-8",
                icon: '',
                label: "转为OGG",

            }, {
                key: "3-9",
                icon: '',
                label: "转为MIDI",

            }, {
                key: "3-10",
                icon: '',
                label: "转为OPUS",

            }, {
                key: "3-11",
                icon: '',
                label: "转为WMA",
            }],
    }, {
        key: "4",
        icon: '',
        label: "AI处理",
        children: [{
            key: "4-1",
            icon: '',
            label: "语音降噪",
        }, {
            key: "4-2",
            icon: '',
            label: "回声消除",

        }, {
            key: "4-3",
            icon: '',
            label: "文本合成语音",

        }, {
            key: "4-4",
            icon: '',
            label: "说话人确认",

        }, {
            key: "4-5",
            icon: '',
            label: "语音转文本",

        }, {
            key: "4-6",
            icon: '',
            label: "文本翻译",

        },
        ],
    }, {
        key: "5",
        icon: '',
        label: "输出",
        children: [
            {
                key: NodeKey.KEY_OUT_PUT_FILE,
                icon: '',
                label: "输出到文件",
            }, {
                key: "5-2",
                icon: '',
                label: "输出到扬声器",
            }, {
                key: "5-3",
                icon: '',
                label: "输出到文本文件",

            }, {
                key: "5-4",
                icon: '',
                label: "输出到显示器",

            },
        ],
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