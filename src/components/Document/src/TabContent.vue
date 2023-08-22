<template>
    <div class="top-tool-bar">
        <a-tooltip title="清空画布所有节点">
            <a-button @click="clearAllNodes" :icon="h(DeleteOutlined)">清空节点</a-button>
        </a-tooltip>
        <a-tooltip title="执行所有节点到输出">
            <a-button @click="execFlow" :icon="h(DeleteOutlined)">全部执行</a-button>
        </a-tooltip>
        <a-tooltip title="清除已加载的缓存">
            <a-button @click="clearCache" :icon="h(DeleteOutlined)">清除缓存</a-button>
        </a-tooltip>
        <a-tooltip title="例子">
            <a-button @click="example" :icon="h(DeleteOutlined)">一个用法举例</a-button>
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
import { execFromRoot } from '@/util/ExecUtil';
import { clearCaches } from '@/util/util'
import { MyWaveSurfer } from '@/types/MyWaveSurfer';
import useCommonStore from '@/store/common'
import { message } from 'ant-design-vue';
import { exampleLineList, exampleNodeList } from "@/util/example";

const store = useCommonStore()
//清空画布
function clearAllNodes() {
    pubsub.publish(Topics.CLEAR_ALL_NODES)
}
async function execFlow() {
    MyWaveSurfer.alowLoading = false
    await execFromRoot()
    MyWaveSurfer.alowLoading = true

}
async function clearCache() {
    message.info("正在清除缓存")
    await clearCaches(store.nodeList)
    message.info("清除完成")
}
function example() {
    console.log();

    localStorage.setItem("nodeList", JSON.stringify(exampleNodeList))
    localStorage.setItem("lineList", JSON.stringify(exampleLineList))
    PubSub.publish(Topics.LOAD_EXAMPLE)

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