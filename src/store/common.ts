import { NodeData } from '@/types';
import { defineStore } from 'pinia'

export default defineStore('common', {
    state: () => {
        return {
            menuItems: Array<NodeData>(
                {
                    key: "1",
                    icon: '',
                    children: [
                        {
                            key: "1-1",
                            icon: '',
                            label: "音频文件输入",
                        }, {
                            key: "1-2",
                            icon: '',
                            label: "视频文件输入",
                        }, {
                            key: "1-3",
                            icon: '',
                            label: "网络输入",
                        }, {
                            key: "1-4",
                            icon: '',
                            label: "文本输入",
                        },
                    ],
                    label: "输入",
                }, {
                key: "2",
                icon: '',
                children: [
                    {
                        key: "2-1",
                        icon: '',
                        label: "裁减",
                    }, {
                        key: "2-2",
                        icon: '',
                        label: "合并",
                    },
                ],
                label: "音频数据处理",
            }, {
                key: "3",
                icon: '',
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
                    },
                ],
                label: "音频格式转换",
            }, {
                key: "4",
                icon: '',
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
                label: "AI处理",
            }, {
                key: "5",
                icon: '',
                children: [
                    {
                        key: "5-1",
                        icon: '',
                        label: "输出为音频文件",
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
                label: "输出",
            }
            ),
            addNode: function (e: any, node: NodeData) {
            }
        }
    },
});