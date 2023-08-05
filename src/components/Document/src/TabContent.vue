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
import { createDirectedGraph, findCycle, hasSingleNode } from '@/util/util'
import { h } from 'vue';
import pubsub from 'pubsub-js'
import { DeleteOutlined } from '@ant-design/icons-vue';
import { StreamType, Topics } from '@/types';
import useCommonStore from '@/store/common';
import { NotificationPlacement, message } from 'ant-design-vue';
import { notification } from 'ant-design-vue';
const store = useCommonStore()
//清空画布
function clearAllNodes() {
    pubsub.publish(Topics.CLEAR_ALL_NODES)
}
//执行流程图
function execFlow() {
    //校验
    if (!validation()) {
        return
    }
    notification.info({
        message: `校验成功`,
        description: "111",
        duration: 2,
        placement: 'bootomRight' as NotificationPlacement
    });
    //排序
    let sortedNode = createDirectedGraph(store.nodeList, store.lineList)

    pubsub.publish(Topics.EXEC_FLOW, sortedNode)
}

function validation() {
    let temp = hasSingleNode(store.lineList, store.nodeList)
    console.log(temp);

    if (temp.length > 0) {
        let ids = temp.map((i) => { return i.id })
        pubsub.publish(Topics.HIGHT_LIGHT_NODES, { ids: temp, ms: 1000 })
        message.error('不允许存在单独节点：' + ids.join('\n'))
        return
    }
    //输入校验
    if (!store.nodeList.some((node) => {
        return node.inputType == StreamType.NONE || node.inputNum == 0
    })) {
        message.error("没有输入节点")
        return false
    } //输出校验
    if (!store.nodeList.some((node) => {
        return node.outputNum == 0
    })) {
        message.error("没有输出节点")
        return false
    }
    let nodes = findCycle(store.lineList)
    if (nodes.length > 0) {
        pubsub.publish(Topics.HIGHT_LIGHT_NODES, nodes)
        message.error("节点：" + nodes.join(",") + "构成环")
        return false
    }
    return true
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