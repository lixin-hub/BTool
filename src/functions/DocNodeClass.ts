import { DocNodeData, StreamType, Property, NodeType, MenuNodeData, NodeOptions, ShortCut } from "@/types";
import { MyWaveSurfer } from "@/types/MyWaveSurfer";
import WaveSurferCache from "@/util/WaveSurferCache";
import { UUID } from "@/util/util";
import { MenuSetting } from "@howdyjs/mouse-menu/dist/types";
import { message } from "ant-design-vue";

export class DocNodeClass implements DocNodeData {
    [key: string]: any
    id: string
    x: string
    y: string
    key: string
    label: string
    icon: string
    properties: Property[]
    pre?: string[]
    next?: string[]
    style?: object
    maxInputNum?: number
    maxOutputNum?: number
    type?: NodeType
    outputPlayload?: any;
    inputPlayload?: any;
    inputType?: StreamType
    outputType?: StreamType
    contextMenuItems: MenuSetting[]
    playload?: AudioBuffer
    customProperties?: Property[]
    prop?: string
    children?: MenuNodeData[]
    constructor(data: NodeOptions) {
        this.key = data.key || '';
        this.id = data.id || UUID()
        this.y = data.y || '0';
        this.x = data.x || '0'
        this.pre = data.pre || [];
        this.next = data.next || [];
        this.style = data.style || {};
        this.maxInputNum = data.maxInputNum || 1
        this.maxOutputNum = data.maxOutputNum || 5;
        this.label = data.label || '';
        this.icon = data.icon || '';
        this.prop = data.prop || '';
        this.contextMenuItems = [
            {
                order: 1,
                label: '执行',
                tips: 'Exec',
                fn: () => {
                    this.exec()
                }
            },
            {
                order: 2,
                label: '打开波形图',
                tips: 'preview',
                fn: () => {
                    this.preview()
                }
            },
            {
                order: 3,
                label: '复制',
                tips: 'Open',
                fn: () => {
                    PubSub.publish(ShortCut.KEY_CTRL_V, this.id)
                }
            }, {
                order: 4,
                label: '粘贴',
                tips: 'Open',
                fn: () => {
                    PubSub.publish(ShortCut.KEY_CTRL_C, this.id)
                }
            },
          
            {
                order: 5,
                label: '删除',
                tips: 'Delete',
                fn: () => {
                    PubSub.publish(ShortCut.KEY_DELETE, this.id)
                    this.destory()
                }
            }
        ];
        this.properties = data.properties || [
            { name: 'id', label: '节点ID' },
            { name: 'label', label: '名称' },
            { name: 'type', label: '节点类型' },
            { name: 'maxInputNum', label: '最大输入' },
            { name: 'inputType', label: '输入类型' },
            { name: 'outputType', label: '输出类型' },
            { name: 'x', label: 'x坐标' },
            { name: 'y', label: 'y坐标' },
            { name: 'playload', label: '节点负载' },
            { name: 'pre', label: '前驱' },
            { name: 'next', label: '后驱' },
        ];

    }
    destory(): void {
        WaveSurferCache.remove(this.id)
    }
    doubleClick(): void {
        throw new Error("Method not implemented.");
    }
    activated(): void {
        throw new Error("Method not implemented.");
    }
    deActivated?(): void {
        throw new Error("Method not implemented.");
    }
    exec() {
        throw new Error("Method not implemented.");
    }
    validate?(): boolean | Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getWs(): MyWaveSurfer {
        return WaveSurferCache.getWaveSurferByNode(this)
    }
    preview() {
        if (!(this.playload instanceof AudioBuffer)){
            message.error("当前节点没有数据，选择文件然后右键执行")
            return
        }
        if (this.getWs().ws.isPlaying()) {
            return
        }
            this.getWs().loadBuffer(this.playload)
    }
}