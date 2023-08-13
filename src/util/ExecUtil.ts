import { createDirectedGraph, findCycle, hasSingleNode } from '@/util/util'
import pubsub from 'pubsub-js'
import { NodeType, Topics } from '@/types';
import useCommonStore from '@/store/common';
import { NotificationPlacement, message } from 'ant-design-vue';
import { notification } from 'ant-design-vue';
const store = useCommonStore()
//从头执行
export  async function execFromRoot(endId?:string) {
    //校验
    if (!validation()) {
        return
    }
    //排序
    let sortedNode = createDirectedGraph(store.nodeList, store.lineList)
    if (sortedNode.length == 0) return
    notification.info({
        message: `正在执行`,
        description: "将会从根节点开始执行",
        duration: 2,
        placement: 'bootomRight' as NotificationPlacement
    });
    store.sortedNodeList = sortedNode
    let playload: any = null;
    for (let i = 0; i < sortedNode.length; i++) {
        let node = sortedNode[i]
        if (node.exec) {
            try {
                pubsub.publish(Topics.HIGHT_LIGHT_NODES, { ids: node.id, ms: 0, type: "info" })
                playload = await node.exec(playload)
                pubsub.publish(Topics.DEHIGHT_LIGHT_NODES, { id: node.id, type: "info" })
                console.log("exec", node.label, playload);
            } catch {
                pubsub.publish(Topics.HIGHT_LIGHT_NODES, { ids: node.id, ms: 5000, type: "error" })
                pubsub.publish(Topics.DEHIGHT_LIGHT_NODES, { id: node.id, type: "info" })
                message.error("发生错误")
                return
            }
        }
    }

    pubsub.publish(Topics.EXEC_FLOW, sortedNode)
}

function validation() {
    let temp = hasSingleNode(store.lineList, store.nodeList)

    if (temp.length > 0) {
        let ids = temp.map((i) => { return i.id })
        pubsub.publish(Topics.HIGHT_LIGHT_NODES, { ids: temp, ms: 1000 })
        message.error('不允许存在单独节点：' + ids.join('\n'))
        return
    }
    //输入校验
    if (!store.nodeList.some((node) => {
        return node.type === NodeType.TYPE_INPUT
    })) {
        message.error("没有输入节点")
        return false
    }
    //  //输出校验
    // if (!store.nodeList.some((node) => {
    //     return node.type === NodeType.TYPE_OUTPUT
    // })) {
    //     message.error("没有输出节点")
    //     return false
    // }
    let nodes = findCycle(store.lineList)
    if (nodes.length > 0) {
        pubsub.publish(Topics.HIGHT_LIGHT_NODES, nodes)
        message.error("节点：" + nodes.join(",") + "构成环")
        return false
    }
    return true
}