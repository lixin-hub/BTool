import { Connection, EndpointOptions } from "jsplumb"

export enum StreamType {
    NONE = 0,//无
    AUDIO = 1,//音频文件
    VIDEO = 2,//视频文件
    TXT = 3,//文本文件
    MONITOR = 4,//监视器预览
    SPEAKER = 6,//扬声器
    WAVE = 7,//示波器
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
/**
 * 菜单栏节点
 */
export interface MenuNodeData {
    type?: NodeType
    key: string
    label?: string,
    icon?: string,
    prop?: string,//描述
    children?: Array<MenuNodeData>,
    endPointOptions?: Array<EndpointOptions>,//端点
    outputNum?: number,//输出分支数
    inputNum?: number,//输入分支数
    maxInputNum?: number,
    maxOutputNum?: number,
    inputType?: StreamType,//输入
    outputType?: StreamType,//输出类型
}
/** 
 *文档内部使用的节点数据结构
 */
export interface DocNodeData extends MenuNodeData {
    id: string,//节点唔一id,//组件唯一id
    x: string,//坐标
    y: string,
    style?: object//自定义样式
}

//pubsub
export enum Topics {
    NODE_ADD = "node_add",
    NODE_DELETE = "node_delete",
    NODE_UPDATE = "node_update",
    NODE_SELECT = "node_select",
    CLEAR_ALL_NODES = "clear_all_nodes"
}