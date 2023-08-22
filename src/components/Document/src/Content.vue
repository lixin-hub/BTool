<template>
    <div ref="root" class="container" id="efContainer">
        <template v-for="node in nodeList" :key="node.key">
            <DocNode @dblclick="doubleClick" @click.right.prevent="showMenu" @changePostion="changePostion"
                :node-data="node" :id="node.id" @click="onNodeClick(node)">
            </DocNode>
        </template>
    </div>
</template>
<script setup lang="ts">
import pubsub from 'pubsub-js'
import { CustomMouseMenu } from '@howdyjs/mouse-menu';
import { Ref, nextTick, onMounted, onUnmounted, reactive, ref, toRaw, watch } from "vue";
import jsPlumbSetting from "@/util/jsPlumbSetting";
import useCommonStore from '@/store/common'
import { DocNodeData, Line, NodeKey, StreamType, Topics, ShortCut, NodeType, NodeOptions } from "@/types";
import { UUID, findDocNodeById, createMousePositionTracker, findCycle, findParentNode, createNodeInstanceByKey } from "@/util/util";
import { DocNode } from "@/components/Node";
import { ConnectParams, Connection, ConnectionMadeEventInfo, OnConnectionBindInfo, jsPlumb, jsPlumbInstance } from "jsplumb";
import { message } from 'ant-design-vue';
import { storeToRefs } from "pinia";
import * as lodash from "lodash";
const commonStore = useCommonStore()
initLocalData()
const nodeList: Array<DocNodeData> = reactive(commonStore.nodeList || [])
const lineList: Array<Line> = reactive(commonStore.lineList || [])
const root: Ref<HTMLDivElement | null> = ref(null)

let instance: jsPlumbInstance = jsPlumb.getInstance()
let scrollLeft = 0;
let scrollTop = 0;
let efContainer: HTMLDivElement | null;
let containerRect: DOMRect
let loadFinish = false
let mouseTracker: { getMousePosition: any; destroy: () => void; };
onMounted(() => {
    efContainer = root.value
    mouseTracker = createMousePositionTracker(500)
    nextTick(() => {
        init();
    })
})
const { activeNode } = storeToRefs(commonStore)
let psateData: DocNodeData | null
//初始化本地数据
function initLocalData() {

    let localNodesStr = localStorage.getItem("nodeList")
    let localLineStr = localStorage.getItem("lineList")

    let localNodes, localLines;
    if (localNodesStr) {
        localNodes = JSON.parse(localNodesStr) as Array<DocNodeData>
        // 根据id去重
        localNodes = lodash.uniqBy(localNodes, "id")
        localNodes.forEach((node) => {
            commonStore.nodeList.push(createNodeInstanceByKey(node.key, node))
        })
    }
    if (localLineStr) {
        localLines = JSON.parse(localLineStr) as Array<Line>
        //根据每一项去重
        lodash.uniqWith(localLines, lodash.isEqual)
        commonStore.lineList = localLines

    }
}
function init() {
    instance.ready(() => {
        // 导入默认配置
        // instance.setContainer('.container')
        instance.importDefaults(jsPlumbSetting.defaultettings)
        // 初始化节点
        loadInitNodeData(nodeList, lineList)
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
        // 判断是否可以连线
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

            if (target.type === NodeType.TYPE_INPUT || target.inputType == StreamType.NONE || target.maxInputNum == 0) {
                message.error("输入结点只能输出")
                return false
            }

            if (source.outputType != target?.inputType) {
                console.log(source, target);
                message.error('源节点的输出类型和目标节点的输入类型不匹配')
                return false
            }
            if (source.type === NodeType.TYPE_OUTPUT || source.maxOutputNum == 0) {
                message.error("输出结点不能连接其它节点")
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

            if (connections.length >= ((target?.maxInputNum) || 1)) {
                message.error("目标节点最大输入数量为:" + (target.maxInputNum))
                return false;
            }

            if (loadFinish) {
                //克隆一下是为了验证是否成环
                let clone = lodash.cloneDeep(lineList)
                clone.push({ from, to })
                let cycle = findCycle(clone)
                if (cycle.length > 0) {
                    cycle.forEach((id) => {
                        hightLihtNode(id, 2000)
                    })
                    message.error('节点间不能形成环')
                    return false
                }
                let line: Line = { from, to }
                //判断是不是合并节点
                let target = findDocNodeById(nodeList, to)
                if (target?.key === NodeKey.KEY_PROCESS_MERGE) {
                    //合并节点加上label
                    let inNum = target.pre?.length || 0
                    line.label = "输入" + (inNum + 1)
                    evt.connection.addOverlay(["Label", {
                        label: line.label,
                        location: 0.5,
                        cssClass: "label-overlay"
                    }]);
                }
                lineList.push(line)
                message.success('连接成功')
                return true
            }
        })
        //节点连接成功
        instance.bind("connection", (evt: ConnectionMadeEventInfo) => {
            let sourceId: string = evt.sourceId
            let targetId: string = evt.targetId
            let source = findDocNodeById(nodeList, sourceId)
            let target = findDocNodeById(nodeList, targetId)
            //建立连接
            if (source && target) {
                target?.pre?.push(sourceId)
                source?.next?.push(targetId)
                //去重 
                if (target)
                    target.pre = lodash.uniq(target.pre)
                if (source)
                    source.next = lodash.uniq(source.next)
            }
        })

    })
}
//添加结点
function addNode(docNode: DocNodeData) {
    nodeList.push(docNode)
    // instance.repaintEverything()
    nextTick(function () {
        instance.makeSource(docNode.id, jsPlumbSetting.sourceOptions)
        instance.makeTarget(docNode.id, jsPlumbSetting.targetOptions)
        instance.draggable(docNode.id)
    })
}
//删除节点
function deleteNode(id: string) {
    let index = nodeList.findIndex(function (node) {
        return node.id === id
    })
    if (index < 0) {
        message.error("请选中结点")
        return
    }
    let node = nodeList[index]
    let preNodeIdList = node.pre
    let nextNodeIdList = node.next
    //去掉在前驱节点中的当前id
    if (preNodeIdList) {
        for (let i = 0; i < preNodeIdList.length; i++) {
            let temp = findDocNodeById(nodeList, preNodeIdList[i])
            if (!temp) { break }
            temp.next = temp.next?.filter((item => { return item != id })) || temp.next
        }
    }
    //去掉在后驱节点中的当前id
    if (nextNodeIdList) {
        for (let i = 0; i < nextNodeIdList.length; i++) {
            let temp = findDocNodeById(nodeList, nextNodeIdList[i])
            if (!temp) { break }
            temp.pre = temp.pre?.filter((item => { return item != id })) || temp.pre
        }
    }
    deleteAllLine(id)
    nodeList.splice(index, 1)
    // activeNode.value = nodeList[0]
    nextTick(function () {
        instance.removeAllEndpoints(id);
    })
}
// 删除线
function deleteLine(from: string, to: string): boolean {
    //去掉在前驱节点中的当前id
    let tempF = findDocNodeById(nodeList, from)
    if (tempF) {
        tempF.next = tempF.next?.filter((item => { return item != to })) || tempF.next
    }

    //去掉在后驱节点中的当前id
    let tempN = findDocNodeById(nodeList, to)
    if (tempN) {
        tempN.pre = tempN.pre?.filter((item => { return item != from })) || tempN.pre
    }

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
//点击节点，激活
function onNodeClick(node: DocNodeData) {
    activatedNode(node)
}
//上下文菜单
const showMenu = (event: MouseEvent) => {
    let node = findParentNode(event.target as HTMLElement, "node")

    if (!node) return
    let an = findDocNodeById(nodeList, node.id)
    if (!an) return
    activatedNode(an)
    const MouseMenuCtx = CustomMouseMenu({
        el: document.getElementById((event?.target as HTMLElement).id || activeNode.value.id) as HTMLElement,
        menuList: activeNode.value.contextMenuItems || []
        // Other Options
    })
    const { x, y } = event;
    MouseMenuCtx.show(x, y);
}
//双击结点（默认行为）
function doubleClick(event: MouseEvent) {
    if (!event) return
    let node = findParentNode(event.target as HTMLElement, "node")
    if (!node) return
    let nodeData = findDocNodeById(nodeList, node.id)
    toRaw(nodeData)?.doubleClick?.call(nodeData, event)

}
// 加载流程图
function loadInitNodeData(nodeList: Array<DocNodeData>, lineList: Array<Line>) {
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
        var connParam: ConnectParams = {
            source: line.from,
            target: line.to,
            overlays: [
                ["Label",
                    {
                        label: line.label,
                        cssClass: "label-overlay",
                        location: 0.5,
                    }
                ]
            ]
        }
        instance.connect(connParam, jsPlumbSetting.connectOptions)
    }
    nextTick(function () {
        loadFinish = true
    })
}
//改变结点位置
function changePostion(data: { id: string; x: string | undefined; y: string | undefined; }) {
    let node = nodeList.find((node) => { return node.id === data.id })
    if (!node) return
    node.x = data.x || node.x;
    node.y = data.y || node.y
    activeNode.value = { ...node }
}
//高亮指定节点
function hightLihtNode(ids: string | DocNodeData[], ms?: number, type?: string) {
    nextTick(() => {
        if (ids instanceof Array) {
            ids.forEach((id) => {
                let el: HTMLElement | null = document.getElementById(id.id)
                if (!el) return
                el.classList.add(type || 'error');
                if (ms != 0)
                    setTimeout(() => {
                        el?.classList.remove(type || 'error');
                    }, ms || 4000)
            })
            return
        }
        let el: HTMLElement | null = document.getElementById(ids)
        if (!el) return
        el.classList.add(type || 'error');
        if (ms != 0)
            setTimeout(() => {
                deHightLihtNode(ids, type)
            }, ms || 4000)
    })
}

//取消高亮指定节点
function deHightLihtNode(id: string, type?: string) {
    let el: HTMLElement | null = document.getElementById(id)
    if (!el) return
    el.classList.remove(type || 'error');
}
function activatedNode(node: DocNodeData) {
    if (node.id === activeNode.value.id) return
    deActivatedNode(activeNode.value)
    deHightLihtNode(activeNode.value.id, "active")
    activeNode.value = node
    hightLihtNode(node.id, 0, "active")
    if (node.activated)
        node.activated()
}
function deActivatedNode(node: DocNodeData) {
    if (node.deActivated) {
        node.deActivated()
    }
}
//监听结点变化
watch(nodeList, (newData) => {
    commonStore.nodeList = newData
    localStorage.setItem("nodeList", JSON.stringify(toRaw(newData)))
})
//监听链接变化
watch(lineList, (newData) => {
    commonStore.lineList = newData
    localStorage.setItem("lineList", JSON.stringify(toRaw(newData)))
})
//清除画板
let unsubscribeClearAllNodes = pubsub.subscribe(Topics.CLEAR_ALL_NODES, () => {
    nodeList.splice(0, nodeList.length)
    lineList.splice(0, lineList.length)
    instance.deleteEveryConnection()
    // init()
})
//删除结点
let unsubscribeDelete = pubsub.subscribe(ShortCut.KEY_DELETE, () => {
    deleteNode(activeNode.value.id)
})
//添加结点
let unsubscribeAddNode = pubsub.subscribe(Topics.NODE_ADD, (_: any, data: { evt: any; node: any; }) => {
    let { evt, node } = data
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

    const options: NodeOptions = {
        ...node,
        id: UUID(),
        x, y,
    }
    let docNode = createNodeInstanceByKey(node.key, options)
    addNode(docNode)
})
//复制粘贴
let unsubscribeCtrlD = pubsub.subscribe(ShortCut.KEY_CTRL_D, () => {
    let clone = lodash.cloneDeep(toRaw(activeNode.value))
    let docNode = { ...clone, y: Number.parseInt(clone.y) + 60 + 'px', id: UUID() }
    addNode(createNodeInstanceByKey(docNode.key, docNode))
    hightLihtNode(docNode.id, 1000, 'info')
})

//复制
let unsubscribeCtrlC = pubsub.subscribe(ShortCut.KEY_CTRL_C, async () => {
    if (!activeNode.value) {
        message.warn("请选中要复制的结点")
        return
    }
    psateData = lodash.cloneDeep(activeNode.value)
    try {
        await navigator.clipboard.writeText(JSON.stringify(activeNode.value))
    } catch { }
    hightLihtNode(activeNode.value.id, 1000, 'info')
    message.success("复制成功")
})

//粘贴
let unsubscribeCtrlV = pubsub.subscribe(ShortCut.KEY_CTRL_V, async () => {
    let temp = psateData
    if (!temp)
        return
    const currentPosition = mouseTracker.getMousePosition();
    if (!efContainer) return
    containerRect = efContainer.getBoundingClientRect()
    let left = currentPosition.x, top = currentPosition.y
    let scrollLeft = efContainer?.scrollLeft || 0
    let scrollTop = efContainer?.scrollTop || 0
    left = left - containerRect.x + scrollLeft
    top = top - containerRect.y + scrollTop
    let docNode = {
        ...temp, x: left + 'px',
        y: top + 'px', id: UUID()
    }

    docNode = createNodeInstanceByKey(docNode?.key, docNode)
    addNode(docNode)
    hightLihtNode(docNode.id, 1000, 'info')
    message.success("粘贴成功")
})
//高亮
let unsubscribeHeight = pubsub.subscribe(Topics.HIGHT_LIGHT_NODES, (_, { ids, ms, type }) => {
    hightLihtNode(ids, ms, type)
})
//取消高亮
let unsubscribeDeHeight = pubsub.subscribe(Topics.DEHIGHT_LIGHT_NODES, (_, { id, type }) => {
    deHightLihtNode(id, type)
})//加载列子
let unsubscribExample = pubsub.subscribe(Topics.LOAD_EXAMPLE, () => {
    location.reload()
})

onUnmounted(function () {
    pubsub.unsubscribe(unsubscribeClearAllNodes)
    pubsub.unsubscribe(unsubscribeCtrlD)
    pubsub.unsubscribe(unsubscribeCtrlC)
    pubsub.unsubscribe(unsubscribeCtrlV)
    pubsub.unsubscribe(unsubscribeDelete)
    pubsub.unsubscribe(unsubscribeAddNode)
    pubsub.unsubscribe(unsubscribeHeight)
    pubsub.unsubscribe(unsubscribeDeHeight)
    pubsub.unsubscribe(unsubscribExample)
    mouseTracker.destroy()
})
</script>
<style lang="scss">
.container {
    width: 100%;
    height: 100%;
    // background-color: antiquewhite;
    position: relative;
}

.label-overlay {
    color: rgb(253, 253, 253);
    font-size: 12px;
}
</style>