import { WaveSurferOptions } from "wavesurfer.js";
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
    height: 30,
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
export default options;