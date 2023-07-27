export enum InputType {
    AUDIO = 1,//音频文件/流
    VIDEO = 2,//视频文件
    TXT = 3,//文本文件
    NETWORK = 4,//网络文件
}
export enum OutPutType {
    AUDIO = 1,//音频文件
    VIDEO = 2,//视频文件
    TXT = 3,//文本文件
    MONITOR = 4,//监视器预览
    SPEAKER = 6,//扬声器
    WAVE = 7,//示波器
}
/**
 * 菜单栏节点
 */
export interface NodeData {
    key?: string
    label?: string,
    icon?: string,
    prop?: string,//描述
    children?: Array<NodeData>,
}
/** 
 *文档内部使用的节点数据结构
 */
export interface DocNode extends NodeData {
    id?: string,//组件唯一id
    ouputNum?: number,//输出分支数
    inputNum?: number,//输入分支数
    x?: number,//坐标
    y?: number,
    inputType?: InputType,//此处应枚举,
    outputType?: OutPutType,
    style?: object
}
