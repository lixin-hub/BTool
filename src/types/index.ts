import { MenuSetting } from "@howdyjs/mouse-menu/dist/types"
import { MyWaveSurfer } from "./MyWaveSurfer"


export enum StreamType {
    NONE = "无",
    AUDIO = "音频",
    VIDEO = "视频",
    TXT = "文本",
    MONITOR = "显示器",
    SPEAKER = "扬声器",
    WAVE = "示波器",
    FILE = "文件"
}
export enum NodeType {
    TYPE_INPUT = "输入节点",
    TYPE_OUTPUT = "输出节点",
    TYPE_AUDIO_PROCESS = "处理节点",
    TYPE_AUDIO_TRANS = "转换节点",
    TYPE_VIDEO_PROCESS = "视频处理节点",
}
export interface Line {
    from: string,
    to: string,
}
export enum NodeKey {
    KEY_FILE_INPUT = "file-input",
    KEY_PROCESS_CUT = "cut",
    KEY_OUT_PUT_MP3 = "mp3",
    KEY_OUT_PUT_WAV = "wav",
    KEY_OUT_PUT_AAC = "aac",
    KEY_OUT_PUT_AIFF = "aiff",
    KEY_OUT_PUT_M4A = "m4a",
    KEY_OUT_PUT_M4R = "m4r",
    KEY_OUT_PUT_MMF = "mmf",
    KEY_OUT_PUT_OGG = "ogg",
    KEY_OUT_PUT_FLAC = "flac",
    KEY_OUT_PUT_OPUS = "opus",
    KEY_OUT_PUT_WMA = "wma",
}
// export interface ContextMenuItem{
//     label: string,
//     tips: string,
//     fn: () => void

// }
export type Property = {
    name: string,
    label: string, //描述
    editable?: boolean,
    type?: string,
}
//基节点
export interface BaseNode {
    key: string
    label: string,
    icon: string,
    prop?: string,//描述
}

/**
 * 节点参数选项，主要作为初始化参数
 */
export interface NodeOptions {
    id?: string,//节点唔一id,
    type?: NodeType,
    x?: string,//坐标
    y?: string,
    maxInputNum?: number,//输入分支数
    maxOutputNum?: number,//输出分支数
    prop?: string//描述
    pre?: string[],//前驱结点
    next?: string[],//后驱节点
    style?: object,//自定义样式
    inputType?: StreamType,//输入
    outputType?: StreamType,//输出类型
    inputPlayload?: any,
    outputPlayload?: any,
    contextMenuItems?: MenuSetting[]//上下文菜单项,
    playload?: any,//结点保存的数据
    properties?: Property[],//属性列表
    customProperties?: Property[],//自定义属性列表
    [key: string]: any // 允许添加未定义的属性
    getWs():MyWaveSurfer,//渲染对象
    doubleClick?(e: MouseEvent):void,
    activated?(): void,//激活
    deActivated?(): void,//失活
    exec? (playload?: any, ...params: any): any,//执行函数,
    validate?() :Promise<boolean> | boolean,//校驗函数
}
/**
 * 菜单栏节点
 */
export interface MenuNodeData extends BaseNode {
    type?: NodeType
    children?: Array<MenuNodeData>,
}
/** 
 *文档内部使用的节点数据结构
 */
export type DocNodeData = BaseNode & {
    id: string,//节点唔一id,//组件唯一id
    x: string,//坐标
    y: string,
    getWs():MyWaveSurfer,//渲染对象
    doubleClick(e: MouseEvent):void,
    activated?(): void,//激活
    deActivated?(): void,//失活
    exec (playload?: any, ...params: any): any,//执行函数,对数据进行处理
    preview (): any,//预览函数,对数据进行预览，如示波器
    validate?() :Promise<boolean> | boolean,//校驗函数
    destory():void,//销
} & NodeOptions

export enum Topics {
    NODE_ADD = "node_add",
    NODE_DELETE = "node_delete",
    NODE_UPDATE = "node_update",
    NODE_SELECT = "node_select",
    CLEAR_ALL_NODES = "clear_all_nodes",
    EXEC_FLOW = "exec_flow",
    HIGHT_LIGHT_NODES = "hight_light_nodes",
    DEHIGHT_LIGHT_NODES = "DEHIGHT_LIGHT_NODES",
    FILE_SLECTED = "FILE_SLECTED"
}
//快捷键
export enum ShortCut {
    KEY_CTRL_D = "ctrl+d",
    KEY_DELETE = "delete",
    KEY_CTRL_C = "ctrl+c",
    KEY_CTRL_V = "ctrl+v",
}