import { DocNodeData, StreamType, Property, NodeType, MenuNodeData, NodeOptions, ShortCut, ContextMenuSetting, Topics } from "@/types";
import { MyWaveSurfer } from "@/types/MyWaveSurfer";
import WaveSurferCache from "@/util/WaveSurferCache";
import { UUID, getPreNodeData } from "@/util/util";
import useCommonStore from '@/store/common';
import { NotificationPlacement, message, notification } from "ant-design-vue";
import { nextTick } from "vue";
const store = useCommonStore()
export class DocNodeClass implements DocNodeData {
    [key: string]: any
    id: string
    x: string
    y: string
    key: string
    label: string
    icon: string
    properties: Property[]
    pre: string[]
    next: string[]
    style?: object
    maxInputNum?: number
    maxOutputNum?: number
    type?: NodeType
    outputPlayload?: any;
    inputPlayload?: any;
    inputType?: StreamType
    outputType?: StreamType
    contextMenuItems: ContextMenuSetting[]
    playload?: AudioBuffer | Blob | AudioBuffer[]
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
                    try {
                        this.exec()
                    } catch (error) {
                        message.error(error + '')
                        console.log(error);

                    }
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
                tips: 'Copy',
                fn: () => {
                    PubSub.publish(ShortCut.KEY_CTRL_V, this.id)
                }
            }, {
                order: 4,
                label: '粘贴',
                tips: 'paste',
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

    activated() {
        this.showWave()
    }
    hideAllWave() {
        store.nodeList.forEach(node => {
            node.hideWave("wave" + node.id)
        })
    }
    deActivated() {
        PubSub.publish(Topics.DEHIGHT_LIGHT_NODES,{id:this.id,type:"active"})
        this.hideAllWave()
    }
    exec(..._parms: any) {
        throw new Error("Method not implemented.");
    }
    validate?(): boolean | Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getWs(): MyWaveSurfer {
        return WaveSurferCache.getWaveSurferByNode(this)
    }
    preview() {
        if (!(this.playload instanceof AudioBuffer)) {
            message.error("当前节点没有数据，选择文件然后右键执行")
            return
        }
        if (this.getWs().ws.isPlaying()) {
            return
        }
        this.getWs().loadBuffer(this.playload)
    }
    showWave(id?: string) {
        let wave: HTMLDivElement = document.getElementById(id || "wave" + this.id) as HTMLDivElement
        if (!wave) return
        wave.style.display = "block"
    }

    hideWave(id?: string) {
        let wave: HTMLDivElement = document.getElementById(id || "wave" + this.id) as HTMLDivElement
        if (!wave) return
        wave.style.display = "none"
    }
    getPreNode(): AudioBuffer | undefined {
        let pre = this.pre[0];
        if (!pre) return
        let buffer = getPreNodeData<AudioBuffer>(store.nodeList, pre)
        if (!buffer) {
            notification.warn({
                message: `无法执行该节点`,
                description: "前一个节点无数据，请选择前一个节点执行或右键选择：'执行到此节点'",
                duration: 3,
                placement: 'bootomRight' as NotificationPlacement
            });
            return
        }
        return buffer
    }
    getPreNodes(): AudioBuffer[] {
        let arr: AudioBuffer[] = []
        for (let i = 0; i < this.pre.length; i++) {
            let pre = this.pre[i];
            let buffer = getPreNodeData<AudioBuffer>(store.nodeList, pre)
            if (buffer)
                arr.push(buffer)
            else {
                PubSub.publish(Topics.HIGHT_LIGHT_NODES, { ids: pre, ms: 2000 })
                message.warn(`节点：${pre} 数据为空！`)
            }
        }
        if (arr.length < this.pre.length) {
            notification.warn(
                {
                    message: "右键节点选择执行到此节点或单击工具栏执行菜单",
                    duration: 4,
                    placement: 'bottomRight'
                }
            )
        }
        return arr
    }

}