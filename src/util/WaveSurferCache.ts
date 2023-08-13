import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js"
import wvOptions from "./WaveSurferOptions"
import { MyWaveSurfer } from "@/types/MyWaveSurfer";
import { DocNodeData } from "@/types";
/**
 * 对解析的渲染数据进行缓存
 */
export default class WaveSurferCache {
    /**
     * 
     * @param key nodeId
     * @param 渲染 数据
     */
    private cache: Map<String, MyWaveSurfer>;

    private static instance: WaveSurferCache;
    private constructor() {
        this.cache = new Map<String, MyWaveSurfer>;
    }
    public static getInstance() {
        if (!WaveSurferCache.instance) this.instance = new WaveSurferCache()
        return this.instance
    }
    protected setCache(key: String, value: MyWaveSurfer) {
        this.cache.set(key, value)
    }
  
    static getWaveSurferById(nodeId: string): MyWaveSurfer {
    
        return this.getInstance().cache.get(nodeId) || this.getInstance().createWaveSurfer(nodeId)
    }
    static getWaveSurferByNode(node: DocNodeData): MyWaveSurfer {
        return this.getWaveSurferById(node.id)
    }
    createWaveSurfer(nodeId: string, options?: WaveSurferOptions): MyWaveSurfer {
        if (this.cache.has(nodeId)) return this.cache.get(nodeId) as MyWaveSurfer
        let div=document.createElement("div")
        div.id="wave"+nodeId
        document.querySelector("#wave")?.appendChild(div)
        wvOptions.container="#wave"+nodeId
        let ws = WaveSurfer.create(Object.assign(wvOptions, options))
        /** When a waveform is loaded */
        ws.on('load', () => {
        })

        /** When a waveform is drawn */
        ws.on('redraw', () => {
        })
        this.setCache(nodeId, new MyWaveSurfer(ws))
        return this.cache.get(nodeId) as MyWaveSurfer

    }
    static has(nodeId: string): boolean {
        return this.getInstance().cache.has(nodeId)
    }
    static remove(nodeId: string): boolean {
        this.getWaveSurferById(nodeId).destroy()
        return this.getInstance().cache.delete(nodeId)
    }
}