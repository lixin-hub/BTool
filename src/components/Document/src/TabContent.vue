<template>
    <div class="top-tool-bar">
        <a-tooltip title="清空画布">
            <a-button @click="clearAllNodes" :icon="h(DeleteOutlined)">清空画布</a-button>
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
function clearAllNodes() {
    pubsub.publish(Topics.CLEAR_ALL_NODES)
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
    height: calc(100vh - 170px);
    z-index: 1;
    overflow: scroll;
}
</style>