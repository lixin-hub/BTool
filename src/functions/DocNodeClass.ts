import { DocNodeData, StreamType, Property, NodeType, MenuNodeData, NodeOptions } from "@/types";
import { UUID } from "@/util/util";
import { MenuSetting } from "@howdyjs/mouse-menu/dist/types";

export class DocNodeClass implements DocNodeData {
    [key: string]: any
    id: string
    x: string
    y: string
    pre?: string[]
    next?: string[]
    style?: object
    maxInputNum?: number
    maxOutputNum?: number
    inputType?: StreamType
    outputType?: StreamType
    doubleClick?: ((e: MouseEvent) => void)
    contextMenuItems?: MenuSetting[]
    playload?: any
    exec?: ((playload?: any, ...params: any) => any)
    validate?: (() => boolean | Promise<boolean>)
    properties: Property[]
    customProperties?: Property[]
    type?: NodeType
    key: string
    label: string
    icon: string
    prop?: string
    children?: MenuNodeData[]
    constructor(data: NodeOptions) {
        this.key = data.key || '';
        this.id = data.id || UUID()
        this.x = data.x || '0'
        this.y = data.y || '0';
        this.pre = data.pre || [];
        this.next = data.next || [];
        this.style = data.style || {};
        this.maxInputNum = data.maxInputNum || 1
        this.maxOutputNum = data.maxOutputNum || 5;
        this.label = data.label || '';
        this.icon = data.icon || '';
        this.prop = data.prop || '';
        this.contextMenuItems = data.contextMenuItems || [
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
        ];
        this.payload = data.playload || {};
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

}