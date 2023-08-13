/**
 * @param audioBuffer 待处理音频流
 * @param start 起始时间（秒）
 * @param end 结束时间（秒）
 * @returns 新的AudioBuffer
 */
export function trimAudioFromBuffer(audioBuffer: AudioBuffer, start: number, end: number): AudioBuffer {
    // 声道数量和采样率
    var channels = audioBuffer.numberOfChannels;
    var rate = audioBuffer.sampleRate;

    // 截取前3秒
    var startOffset =rate* start;
    var endOffset = rate * end;
    var frameCount = endOffset - startOffset;
    // 创建同样采用率、同样声道数量，长度是前3秒的空的AudioBuffer
    var newAudioBuffer = new AudioContext().createBuffer(channels, endOffset - startOffset, rate);
    // 创建临时的Array存放复制的buffer数据
    var anotherArray = new Float32Array(frameCount);
    // 声道的数据的复制和写入
    var offset = 0;
    for (var channel = 0; channel < channels; channel++) {
        audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
        newAudioBuffer.copyToChannel(anotherArray, channel, offset);
    }

    // newAudioBuffer就是全新的复制的3秒长度的AudioBuffer对象
    return newAudioBuffer;
}

/**
 * 从文件裁切音频
 */
export async function trimAudioFromFile(file: File, start: number, end: number): Promise<AudioBuffer> {
    let audioBuffer = await fileToAudioBuffer(file);
    return trimAudioFromBuffer(audioBuffer, start, end);
}
/**
 *  将文件转换为AudioBuffer
 * @param file 输入音频文件
 * @returns 
 */
export function fileToAudioBuffer(file: File): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const arrayBuffer = event.target?.result as ArrayBuffer;
            const audioCtx = new AudioContext();

            audioCtx.decodeAudioData(arrayBuffer, resolve, reject);
        };

        reader.onerror = () => {
            reject(new Error('Failed to read the file.'));
        };

        reader.readAsArrayBuffer(file);
    });
}
/**
 * 将 AudioBuffer 转换为 Blob 对象
 * @param audioBuffer 待转换的 AudioBuffer
 * @returns 转换后的 Blob 对象
 */
export function convertAudioBufferToBlob(abuffer: AudioBuffer): Promise<Blob> {

    return new Promise((resolve, _reject) => {
        // Convert AudioBuffer to a Blob using WAVE representation
        let numOfChan = abuffer.numberOfChannels,
            len = abuffer.getChannelData(0).length,
            length = len * numOfChan * 2 + 44,
            buffer = new ArrayBuffer(length),
            view = new DataView(buffer),
            channels = [], i, sample,
            offset = 0,
            pos = 0;

        // write WAVE header
        // "RIFF"
        setUint32(0x46464952);
        // file length - 8                      
        setUint32(length - 8);
        // "WAVE"                     
        setUint32(0x45564157);
        // "fmt " chunk
        setUint32(0x20746d66);
        // length = 16                       
        setUint32(16);
        // PCM (uncompressed)                               
        setUint16(1);
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        // avg. bytes/sec
        setUint32(abuffer.sampleRate * 2 * numOfChan);
        // block-align
        setUint16(numOfChan * 2);
        // 16-bit (hardcoded in this demo)
        setUint16(16);
        // "data" - chunk
        setUint32(0x61746164);
        // chunk length                   
        setUint32(length - pos - 4);

        // write interleaved data
        for (i = 0; i < abuffer.numberOfChannels; i++)
            channels.push(abuffer.getChannelData(i));

        while (pos < length) {
            // interleave channels
            for (i = 0; i < numOfChan; i++) {
                // clamp
                sample = Math.max(-1, Math.min(1, channels[i][offset]));
                // scale to 16-bit signed int
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                // write 16-bit sample
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            // next source sample
            offset++
        }
        // create Blob
        function setUint16(data: number) {
            view.setUint16(pos, data, true);
            pos += 2;
        }

        function setUint32(data: number) {
            view.setUint32(pos, data, true);
            pos += 4;
        }
        resolve(new Blob([buffer], { type: "audio/wav" }))
    })
}


/**
 * 将 Blob 对象保存为文件
 * @param blob 要保存的 Blob 对象
 * @param filename 文件名
 */
export function saveBlobAsFile(blob: Blob, filename: string): Promise<void> {
    return new Promise((resolve) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        resolve()
    })
}


