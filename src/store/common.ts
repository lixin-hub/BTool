import { DocNodeData, Line, MenuNodeData, NodeKey } from '@/types';
import { defineStore } from 'pinia'
import WaveSurfer from 'wavesurfer.js';

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
            key: NodeKey.KEY_PROCESS_MERGE,
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
        },
        {
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
        key: "3",
        icon: '',
        label: "输出",
        children: [
            {
                key: NodeKey.KEY_OUT_PUT_MP3,
                icon: '',
                label: "输出为MP3",
            }, {
                key: NodeKey.KEY_OUT_PUT_WAV,
                icon: '',
                label: "输出为WAV",
            }, {
                key: NodeKey.KEY_OUT_PUT_AAC,
                icon: '',
                label: "输出为AAC",
            }, {
                key: NodeKey.KEY_OUT_PUT_FLAC,
                icon: '',
                label: "输出为FLAC",
            }, {
                key: NodeKey.KEY_OUT_PUT_AIFF,
                icon: '',
                label: "输出为AIFF",

            }, {
                key: NodeKey.KEY_OUT_PUT_M4A,
                icon: '',
                label: "输出为M4A",

            }, {
                key: NodeKey.KEY_OUT_PUT_M4R,
                icon: '',
                label: "输出为M4R",
            }, {
                key: NodeKey.KEY_OUT_PUT_MMF,
                icon: '',
                label: "输出为MMF",
            }, {
                key: NodeKey.KEY_OUT_PUT_OGG,
                icon: '',
                label: "输出为OGG",

            }, {
                key: NodeKey.KEY_OUT_PUT_OPUS,
                icon: '',
                label: "输出为OPUS",

            }, {
                key: NodeKey.KEY_OUT_PUT_WMA,
                icon: '',
                label: "输出为WMA",
            }],
    },
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
                file: {} as File,
                cache: new Map<Blob, Array<Number>>()
            },
            mregeOption: {
                showMergeView: false,
                input1: {
                    width: 100,
                    left:0,
                    right:0
                }, 
                input2: {
                    width: 100,
                    left:0,
                    right:0
                }


            },
            waveSurfer: {} as WaveSurfer,
            sortedNodeList: Array<DocNodeData>(),
        }
    },

});
export default useStore;