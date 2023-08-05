<template>
    <div id="wave">
    </div>
</template>
<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'
import useCommonStore from '@/store/common';
import { message } from 'ant-design-vue';
const store = useCommonStore()
let ws: WaveSurfer
let wsRegions: RegionsPlugin
let loadWaveMessage: () => void;
// 创建一个 canvas 渐变
const ctx = document.createElement('canvas').getContext('2d')
const gradient = ctx?.createLinearGradient(0, 0, 0, 150)
gradient?.addColorStop(0, 'rgb(200, 0, 200)')
gradient?.addColorStop(0.7, 'rgb(100, 0, 100)')
gradient?.addColorStop(1, 'rgb(0, 0, 0)')


const options: WaveSurferOptions = {
    /** HTML element or CSS selector (required) */
    container: '#wave',
    /** The height of the waveform in pixels */
    height: 50,
    /** Render each audio channel as a separate waveform */
    splitChannels: [],
    /** Stretch the waveform to the full height */
    normalize: true,
    /** The color of the waveform */
    // waveColor: '#ff4e00',
    /** The color of the progress mask */
    // progressColor: '#dd5e98',
    /** The color of the playpack cursor */
    cursorColor: '#ddd5e9',
    /** The cursor width */
    cursorWidth: 2,
    barWidth: 1,
    mediaControls: true,
    waveColor: gradient,
    progressColor: 'rgba(0, 0, 100, 0.5)',

}
onMounted(() => {

    ws = WaveSurfer.create(options)
    wsRegions = ws.registerPlugin(RegionsPlugin.create())


    // Give regions a random color when they are created
    const random = (min: number, max: number) => Math.random() * (max - min) + min
    const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`
    ws.on('load', () => {
        loadWaveMessage = message.loading('正在解析，请稍候！', 0);
    })
    // Create some regions at specific time ranges
    ws.on('decode', () => {
        // Regions
        wsRegions.addRegion({
            start: 0,
            end: 100,
            color: randomColor(),
        })
    })
    /** When a waveform is drawn */
    ws.on('redraw', () => {
        loadWaveMessage?.call(this)
    })


    // wsRegions.enableDragSelection({
    //     color: 'rgba(255, 0, 0, 0.1)',
    // })

    wsRegions.on('region-updated', (region) => {
        console.log('Updated region', region)
    })
    wsRegions.on('region-clicked', (region, e) => {
        e.stopPropagation() // prevent triggering a click on the waveform
        // activeRegion = region
        region.play()
        region.setOptions({ color: randomColor() })
    })

})
watch(store.wavedata, async (newData) => {
    if (newData.file) {
        ws.loadBlob(newData.file).catch(() => {
            message.error("发生错误")
            loadWaveMessage?.call(this)
        })
    }
})
</script>
<style  scoped></style>