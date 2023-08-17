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
    private _cache: Map<String, MyWaveSurfer>
    public get cache(): Map<String, MyWaveSurfer> {
        return this._cache;
    }
    public set cache(value: Map<String, MyWaveSurfer>) {
        this._cache = value;
    }

    private static instance: WaveSurferCache;
    private constructor() {
        this._cache = new Map<String, MyWaveSurfer>;
    }

    public static getInstance() {
        if (!WaveSurferCache.instance) this.instance = new WaveSurferCache()
        return this.instance
    }
    protected setCache(key: String, value: MyWaveSurfer) {
        this.cache.set(key, value)
    }

    static getWaveSurferById(nodeId: string, options?: WaveSurferOptions): MyWaveSurfer {
        return this.getInstance().createWaveSurfer(nodeId, options)
    }
    static getWaveSurferByNode(node: DocNodeData, nullable = false): MyWaveSurfer | undefined {
        return nullable ? (
            this.getInstance().cache.get(node.id)
        ) : this.getWaveSurferById(node.id)
    }
    createWaveSurfer(nodeId: string, options?: WaveSurferOptions): MyWaveSurfer {
        if (this.cache.has(nodeId)) return this.cache.get(nodeId) as MyWaveSurfer
        let id = "wave" + nodeId
       let el= document.querySelector(id)
        let div = el||document.createElement("div")
        div.id=id
        if(!el){
            document.querySelector("#wave")?.appendChild(div)
        }
        wvOptions.container = "#wave" + nodeId
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
        if (!nodeId) return false
        let ws = this.getInstance().cache.get(nodeId)
        if (ws) {
            ws.destroy()            
            return this.getInstance().cache.delete(nodeId)
        }
        return false
    }
}