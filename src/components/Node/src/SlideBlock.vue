<template>
    <div id="input-block" ref="block" @mouseup="onMouseUp" v-drag="{useY:false}" :style="{ left: 0, width }">
        <slot></slot>
    </div>
</template>
<script lang="ts" setup>
import { Ref, ref } from 'vue';

const block: Ref<HTMLDivElement | null> = ref(null);
const props=defineProps(["width","index"])
const emit = defineEmits(["offsetChange"])

function onMouseUp() {
    // 使用$refs来访问DOM元素
    if (!block.value) return
    const left = Number.parseInt(block.value.style.left)
    const rect = block.value.getBoundingClientRect();
    const parentRect = block.value.parentElement?.getBoundingClientRect()    
    if (parentRect)
        emit('offsetChange',props.index, left, parentRect.width - left -rect.width, rect)

}
</script>
<style scoped >
#input-block {
    top: 5px;
    margin: 0 10px;
    position: absolute;
    background-color: antiquewhite;
    height: 35px;
}
</style>
