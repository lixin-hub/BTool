<template>
    <div class="node" ref="node" :style="myStyle" @mouseup="changePostion">
        <label @pointerover.="" class="icon flow-node-drag">
        </label>
        <label class="label">{{ nodeData.label }}</label>
    </div>
</template>
<script lang="ts" setup>
import { ref, getCurrentInstance, computed, Ref } from 'vue';
import { DocNodeData } from '@/types';
let node: Ref<HTMLDivElement | null> = ref<HTMLDivElement | null>(null);
const props = defineProps<{ nodeData: DocNodeData }>();

const myStyle = computed(() => ({
    top: props.nodeData.y,
    left: props.nodeData.x
}));
let ins = getCurrentInstance()

function changePostion(_e: MouseEvent) {
    if (!node) return;
    const nodeVal = node.value;
    if (!nodeVal) return
    // 避免抖动
    if (props.nodeData.x === nodeVal.style.left && props.nodeData.y === nodeVal.style.top) {
        return;
    }
    if (!ins) return
    ins.emit('changePostion', {
        id: nodeVal.id,
        x: nodeVal.style.left,
        y: nodeVal.style.top,
    });
}
</script>
<style scoped>
.icon {
    cursor: crosshair;
    padding-left: 25px;
    width: 25px;
    height: 25px;
    background-repeat: no-repeat;
    background-size: 25px 25px;
    background-position: center;
    background-image: url('../../../assets/vue.svg');
}

.label {
    width: 60%;
}

.node {
    display: flex;
    font-size: small;
    justify-content: space-around;
    align-items: center;
    width: 150px;
    color: white;
    line-height: 30px;
    background-color: goldenrod;
    border-radius: 5px;
    height: 30px;
    position: absolute;
    transition: opacity 0.3s ease-in-out;
}

.active {
    background-color: rgb(96, 250, 255);
    color: rgb(58, 55, 55);
    box-shadow: 0 0 5px 5px rgb(35, 124, 139);

}

.error {
    background-color: rgb(255, 48, 93);
    color: black;
}

.info {
    background-color: rgb(48, 131, 255);
    color: white
}
.run {
    background-color: rgb(255, 96, 48);
    color: white
}
</style>
