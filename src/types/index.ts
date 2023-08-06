import { MenuSetting } from "@howdyjs/mouse-menu/dist/types"
import { EndpointOptions } from "jsplumb"


export enum StreamType {
    NONE = "NONE",
    AUDIO = "AUDIO",
    VIDEO = "VIDEO",
    TXT = "TEX",
    MONITOR = "MONITOR",
    SPEAKER = "SPEAKER",
    WAVE = "WAVE",
    FILE = "FILE"
}
export enum NodeType {
    TYPE_INPUT = 1,
    TYPE_OUTPUT = 2,
    TYPE_AUDIO_PROCESS = 3,
    TYPE_AUDIO_TRANS = 4,
    TYPE_VIDEO_PROCESS = 5,
}
export interface Line {
    from: string,
    to: string,
}
// export interface ContextMenuItem{
//     label: string,
//     tips: string,
//     fn: () => void

// }

/**
 * 菜单栏节点
 */
export interface MenuNodeData {
    type: NodeType
    key: string
    label?: string,
    icon?: string,
    prop?: string,//描述
    children?: Array<MenuNodeData>,
    endPointOptions?: Array<EndpointOptions>,//端点
    maxInputNum?: number,//输入分支数
    maxOutputNum?: number,//输出分支数
    inputType?: StreamType,//输入
    outputType?: StreamType,//输出类型
    doubleClick?: (e: MouseEvent) => void,
    contextMenuItems?: MenuSetting[]//上下文菜单项,
    playload?: any,//结点保存的数据
    exec?: (playload?: any, ...params: any) => any,//执行函数,
    validate?: () => Promise<boolean> | boolean,//校驗函数
    [key: string]: any // 允许添加未定义的属性

}
/** 
 *文档内部使用的节点数据结构
 */
export interface DocNodeData extends MenuNodeData {
    id: string,//节点唔一id,//组件唯一id
    x: string,//坐标
    y: string,
    style?: object,//自定义样式
}

//pubsub

export enum Topics {
    NODE_ADD = "node_add",
    NODE_DELETE = "node_delete",
    NODE_UPDATE = "node_update",
    NODE_SELECT = "node_select",
    CLEAR_ALL_NODES = "clear_all_nodes",
    EXEC_FLOW = "exec_flow",
    HIGHT_LIGHT_NODES = "hight_light_nodes",
    DEHIGHT_LIGHT_NODES = "DEHIGHT_LIGHT_NODES"
}
//快捷键
export enum ShortCut {
    KEY_CTRL_D = "ctrl+d",
    KEY_DELETE = "delete",
    KEY_CTRL_C = "ctrl+c",
    KEY_CTRL_V = "ctrl+v",
}