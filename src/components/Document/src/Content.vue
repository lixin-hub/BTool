<template>
    <div ref="root" class="container" id="efContainer">
        <template v-for="node in nodeList" :key="node.key">
            <DocNode @click.right.prevent="showMenu" @changePostion="changePostion" :node-data="node" :id="node.id"
                @click="onNodeClick(node)">
            </DocNode>
        </template>
    </div>
</template>
<script setup lang="ts">
import pubsub from 'pubsub-js'
import { CustomMouseMenu } from '@howdyjs/mouse-menu';
import { nextTick, onMounted, onUnmounted, reactive, ref, toRaw, watch } from "vue";
import jsPlumbSetting from "@/util/jsPlumbSetting";
import useCommonStore from '@/store/common'
import { DocNodeData, MenuNodeData, Line, StreamType, Topics } from "@/types";
import { UUID, findDocNodeById, findCycle, findParentNode } from "@/util/util";
import { DocNode } from "@/components/Node";
import { Connection, OnConnectionBindInfo, jsPlumb, jsPlumbInstance } from "jsplumb";
import { message } from 'ant-design-vue';
import { storeToRefs } from "pinia";
import * as lodash from "lodash";
const commonStore = useCommonStore()
let localNodesStr = localStorage.getItem("nodeList")
let localLineStr = localStorage.getItem("lineList")

let localNodes, localLines;
if (localNodesStr) {
    localNodes = JSON.parse(localNodesStr) as Array<DocNodeData>

}
if (localLineStr) {
    localLines = JSON.parse(localLineStr) as Array<Line>
    commonStore.lineList = localLines

}
const nodeList: Array<DocNodeData> = reactive(localNodes || [])
const lineList: Array<Line> = reactive(commonStore.lineList || [])
const root = ref(null)
let instance: jsPlumbInstance = jsPlumb.getInstance()
let scrollLeft = 0;
let scrollTop = 0;
let efContainer: HTMLDivElement | null;
let containerRect: DOMRect
let loadFinish = false
onMounted(() => {
    nextTick(() => {
        init();
    })
})
const { activeNode } = storeToRefs(commonStore)

function init() {
    instance.ready(() => {
        // 导入默认配置
        // instance.setContainer('.container')
        instance.importDefaults(jsPlumbSetting.defaultettings)
        // 初始化节点
        loadInitNodeData()
        // 会使整个jsPlumb立即重绘。
        instance.setSuspendDrawing(false, true);
        // 单点击了连接线
        instance.bind('click', () => {
            console.log("点击了连线");

        })
        // 连线右键点击事件
        instance.bind("contextmenu", function (conn: OnConnectionBindInfo, originalEvent) {
            // 阻止默认的右键菜单弹出
            originalEvent.preventDefault();
            // 获取右键点击的连线的源点和目标点ID
            var sourceId = conn.sourceId;
            var targetId = conn.targetId;
            if (deleteLine(sourceId, targetId)) {
                let tscope = instance.getTargetScope(sourceId)
                let connections = instance.getConnections(tscope, { source: sourceId, target: targetId })
                let connect = connections.find((item: Connection) => {
                    return (item.sourceId === sourceId && item.targetId === targetId)
                })
                if (!connect) {
                    message.success("请刷新")
                    return false
                }
                instance.deleteConnection(connect)
                message.success("删除成功")
            } else {
                message.success("删除失败")
            }
        });
        // 连线
        instance.bind("beforeDrop", (evt: OnConnectionBindInfo) => {

            let from: string = evt.connection.source.id
            let to: string = evt.connection.target.id
            let source = findDocNodeById(nodeList, from)
            let target = findDocNodeById(nodeList, to)
            if (target == null || source == null) {
                message.error("参数错误")
                return false
            }
            let tscope = instance.getTargetScope(to)

            if (target.inputType == StreamType.NONE) {
                message.error("目标节点不能连接输入")
                return false
            }
            if (source.outputType != target?.inputType) {
                message.error('源节点的输出类型和目标节点的输入类型不匹配')
                return false
            }
            // if(target?.inputNum,)
            if (from === to) {
                message.error('节点不支持连接自己')
                return false
            }
            if (hasLine(from, to)) {
                message.error('该关系已存在,不允许重复创建')
                return false
            }
            if (hashOppositeLine(from, to)) {
                message.error('不支持两个节点之间连线回环');
                return false
            }
            //获取目标节点的所有连接
            let connections = instance.getConnections(tscope, { target: to })

            connections = connections.filter((item: any) => item.targetId === to)

            if (connections.length >= ((target?.maxInputNum || target?.inputNum) || 1)) {
                message.error("目标节点最大输入数量为:" + (target.maxInputNum || target.inputNum))
                return false;
            }

            if (loadFinish) {
                let clone = lodash.cloneDeep(lineList)
                clone.push({ from, to })
                let cycle = findCycle(clone)
                if (cycle.length > 0) {
                    message.error('节点间不能形成环')
                    console.log("cycle", cycle);
                    return false
                }
                lineList.push({ from, to })
                message.success('连接成功')
                return true
            }
        })
    })
}
commonStore.addNode = (evt: any, node: MenuNodeData) => {
    let screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
    efContainer = root.value
    if (efContainer == null) { return }
    efContainer = (efContainer as HTMLDivElement)
    containerRect = efContainer.getBoundingClientRect()
    let left = screenX, top = screenY
    // 计算是否拖入到容器中
    if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
        message.warn("请把节点拖入到画布中")
        return
    }

    scrollLeft = efContainer.scrollLeft
    scrollTop = efContainer.scrollTop
    left = left - containerRect.x + scrollLeft
    top = top - containerRect.y + scrollTop
    // 居中
    let x = left - 100 + 'px'
    let y = top - 20 + 'px'

    const docNode: DocNodeData = {
        id: UUID(),
        ...node,
        x, y,
    }
    nodeList.push(docNode)
    // instance.repaintEverything()
    nextTick(function () {
        instance.makeSource(docNode.id, jsPlumbSetting.sourceOptions)
        instance.makeTarget(docNode.id, jsPlumbSetting.targetOptions)

        instance.draggable(docNode.id, {
            containment: 'parent',
            stop: function (_el) {
                // 拖拽节点结束后的对调
                // console.log('拖拽结束: ', el)
            }
        })
        // docNode.endPointOptions?.forEach((item) => {
        //     instance.addEndpoint(docNode.id, { ...item, uuid: UUID(5) })
        // })
    })
}
//删除节点
function deleteNode(id: string) {
    deleteAllLine(id)
    let index = nodeList.findIndex(function (node) {
        return node.id === id
    })
    nodeList.splice(index, 1)
    nextTick(function () {
        instance.removeAllEndpoints(id);
    })
}
// 删除线
function deleteLine(from: string, to: string): boolean {
    let index = lineList.findIndex(function (line) {
        return (line.from === from && line.to === to)
    })
    if (index >= 0) {
        lineList.splice(index, 1)
        return true;
    }
    return false
}
//删除节点相关联的线段和连接
function deleteAllLine(nodeId: string) {
    let tscope = instance.getTargetScope(nodeId)
    let connections = instance.getConnections(tscope, { source: nodeId, target: nodeId })
    console.log("conn", connections);
    connections = connections.filter((item: any) => item.targetId === nodeId || item.sourceId == nodeId)
    connections.forEach((conn: Connection) => {
        deleteLine(conn.sourceId, conn.targetId)
        instance.deleteConnection(conn)
    })
}
function hasLine(from: string, to: string): boolean {
    for (var i = 0; i < lineList.length; i++) {
        var line = lineList[i]
        if (line.from === from && line.to === to) {
            return true
        }
    }
    return false
}
// 是否含有相反的线
function hashOppositeLine(from: string, to: string): boolean {
    return hasLine(to, from)
}
function onNodeClick(node: DocNodeData) {
    activeNode.value = node

}
//上下文菜单
const showMenu = (event: MouseEvent) => {
    let node = findParentNode(event.target as HTMLElement, "node")

    if (!node) return
    let an = findDocNodeById(nodeList, node.id)
    if (!an) return
    activeNode.value = an
    const MouseMenuCtx = CustomMouseMenu({
        el: document.getElementById((event?.target as HTMLElement).id || activeNode.value.id) as HTMLElement,
        menuList: [
            {
                label: '打开',
                tips: 'Open',
                fn: () => {
                }
            },
            {
                label: '编辑',
                tips: 'Edit',
                fn: () => {
                }
            },
            {
                label: '删除',
                tips: 'Delete',
                fn: () => {
                    deleteNode(node?.id || activeNode.value.id)
                }
            },
            {
                label: '重命名',
                tips: 'Rename',
                fn: () => {
                }
            }
        ]
        // Other Options
    })
    const { x, y } = event;
    MouseMenuCtx.show(x, y);
}
// 加载流程图
function loadInitNodeData() {
    // 初始化节点
    for (let i = 0; i < nodeList.length; i++) {
        let node = nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        instance.makeSource(node.id, lodash.merge(jsPlumbSetting.sourceOptions, {}))
        // // 设置目标点，其他源点拖出的线可以连接该节点
        instance.makeTarget(node.id, jsPlumbSetting.targetOptions)
        instance.draggable(node.id, {
            containment: 'parent',
            stop: function () {

            }
        })

    }
    // 初始化连线
    for (var i = 0; i < lineList.length; i++) {
        let line = lineList[i]
        var connParam = {
            source: line.from,
            target: line.to,
        }
        instance.connect(connParam, jsPlumbSetting.connectOptions)
    }
    nextTick(function () {
        loadFinish = true
    })
}
function changePostion(data: { id: string; x: string | undefined; y: string | undefined; }) {
    let node = nodeList.find((node) => { return node.id === data.id })

    if (!node) return
    node.x = data.x || node.x;
    node.y = data.y || node.y
    activeNode.value = { ...node }
}

watch(nodeList, (newData) => {
    localStorage.setItem("nodeList", JSON.stringify(toRaw(newData)))

})

watch(lineList, (newData) => {
    commonStore.lineList = newData
    localStorage.setItem("lineList", JSON.stringify(toRaw(newData)))
})
let unsubscribeClearAllNodes = pubsub.subscribe(Topics.CLEAR_ALL_NODES, () => {
    nodeList.splice(0, nodeList.length)
    lineList.splice(0, lineList.length)
    instance.deleteEveryConnection()
    // init()

})
onUnmounted(function () {
    pubsub.unsubscribe(unsubscribeClearAllNodes)
})
</script>
<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    // background-color: antiquewhite;
    position: relative;

}
</style>