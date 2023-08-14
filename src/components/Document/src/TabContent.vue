<template>
    <div class="top-tool-bar">
        <a-tooltip title="清空画布">
            <a-button @click="clearAllNodes" :icon="h(DeleteOutlined)">清空</a-button>
        </a-tooltip>
        <a-tooltip title="执行流程">
            <a-button @click="execFlow" :icon="h(DeleteOutlined)">执行</a-button>
        </a-tooltip>

    </div>
    <div class="content">
        <Background>
            <slot></slot>
        </Background>
    </div>
</template>
<script lang="ts" setup>
import Background from './Background.vue';
import { h } from 'vue';
import pubsub from 'pubsub-js'
import { DeleteOutlined } from '@ant-design/icons-vue';
import { Topics } from '@/types';
import {  execFromRoot } from '@/util/ExecUtil';
//清空画布
function clearAllNodes() {
    pubsub.publish(Topics.CLEAR_ALL_NODES)
}
function execFlow(){
    execFromRoot()
}
</script>
  
<style scoped>
.top-tool-bar {
    padding-left: 10px;
    display: flex;
    justify-content: start;
    align-items: center;
    height: 40px;
    width: 100%;
    background-color: aliceblue;
}

.content {
    margin: 0;
    height: 100%;
    z-index: 1;
    overflow: scroll;
}
</style>