/**
 * 
 * @param audioBuffer 待处理音频流
 * @param start 起始
 * @param end 结束
 * @returns 新的audiobuffer
 */
export function trimAudio(audioBuffer: AudioBuffer, start: number, end: number): AudioBuffer {
    const audioCtx = new AudioContext();
    const sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;

    const duration = end - start;
    const destinationBuffer = audioCtx.createBuffer(audioBuffer.numberOfChannels, duration, audioBuffer.sampleRate);

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const inputData = audioBuffer.getChannelData(channel);
        const outputData = destinationBuffer.getChannelData(channel);
        const startOffset = start * audioBuffer.sampleRate;
        const endOffset = end * audioBuffer.sampleRate;

        for (let i = startOffset, j = 0; i < endOffset; i++, j++) {
            outputData[j] = inputData[i];
        }
    }

    sourceNode.buffer = destinationBuffer;
    sourceNode.connect(audioCtx.destination);
    sourceNode.start();

    return destinationBuffer;
}
export async function trimAudioFromFile(file: File, start: number, end: number): Promise<AudioBuffer> {
    let audioBuffer = await fileToAudioBuffer(file);
    return trimAudio(audioBuffer, start, end);
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
 * 将 AudioBuffer 对象保存为本地音频文件。
 * @param audioBuffer 要保存的 AudioBuffer 对象。
 * @param filename 要保存的文件名，包括文件扩展名（例如：'audio.wav'）。
 * @returns 一个 Promise，当音频文件保存成功时解析，保存失败时拒绝。
 */
export function audioBufferToFile(audioBuffer: AudioBuffer, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const offlineCtx = new OfflineAudioContext({
            numberOfChannels: audioBuffer.numberOfChannels,
            length: audioBuffer.length,
            sampleRate: audioBuffer.sampleRate
        });

        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineCtx.destination);
        source.start();

        offlineCtx.oncomplete = (event: OfflineAudioCompletionEvent) => {
            const renderedBuffer = event.renderedBuffer;
            const audioData = new Float32Array(renderedBuffer.length * renderedBuffer.numberOfChannels);

            for (let channel = 0; channel < renderedBuffer.numberOfChannels; channel++) {
                const channelData = renderedBuffer.getChannelData(channel);
                audioData.set(channelData, channel * renderedBuffer.length);
            }

            const wavBuffer = new ArrayBuffer(44 + audioData.byteLength);
            const dv = new DataView(wavBuffer);

            function writeString(offset: number, str: string) {
                for (let i = 0; i < str.length; i++) {
                    dv.setUint8(offset + i, str.charCodeAt(i));
                }
            }

            function writeUint32(offset: number, value: number) {
                dv.setUint32(offset, value, true);
            }

            function writeUint16(offset: number, value: number) {
                dv.setUint16(offset, value, true);
            }

            // WAV 文件头部
            writeString(0, 'RIFF');                           // ChunkID
            writeUint32(4, 36 + audioData.byteLength);        // ChunkSize
            writeString(8, 'WAVE');                           // Format
            writeString(12, 'fmt ');                          // Subchunk1ID
            writeUint32(16, 16);                               // Subchunk1Size
            writeUint16(20, 1);                                // AudioFormat (PCM)
            writeUint16(22, audioBuffer.numberOfChannels);     // NumChannels
            writeUint32(24, audioBuffer.sampleRate);           // SampleRate
            writeUint32(28, audioBuffer.sampleRate * 2);       // ByteRate
            writeUint16(32, 2);                                // BlockAlign
            writeUint16(34, 16);                               // BitsPerSample
            writeString(36, 'data');                           // Subchunk2ID
            writeUint32(40, audioData.byteLength);             // Subchunk2Size

            // 音频数据
            const audioDataOffset = 44;
            const wavDataView = new DataView(wavBuffer, audioDataOffset);

            for (let i = 0; i < audioData.length; i++) {
                const sample = Math.max(-1, Math.min(1, audioData[i]));
                const sampleInt = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                wavDataView.setInt16(i * 2, sampleInt, true);
            }

            const blob = new Blob([dv], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();

            resolve();
        };

        offlineCtx.startRendering();
    });
}

