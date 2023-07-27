<template>
    <div ref="root" class="container">
        <div v-for="node in nodeList" :key="node.key" :style="node.style" class="node">
            <Node :node-data="node" :id="node.id"></Node>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import useCommonStore from '@/store/common'
import { NodeData, DocNode } from "@/types";
import { UUID } from "@/util/util";
import _ from "lodash";
import { jsPlumb } from "jsplumb";
const commonStore = useCommonStore()
const nodeList: Array<DocNode> = reactive([])
const root = ref(null)
onMounted(() => {
})
commonStore.addNode = (evt: any, node: NodeData) => {
    console.dir(node);
    let screenX = evt.originalEvent.clientX, screenY = evt.originalEvent.clientY
    let efContainer = root.value
    if (!efContainer) { return }
    let containerRect = efContainer.getBoundingClientRect()
    let left = screenX, top = screenY
    // 计算是否拖入到容器中
    if (left < containerRect.x || left > containerRect.width + containerRect.x || top < containerRect.y || containerRect.y > containerRect.y + containerRect.height) {
        console.log("请把节点拖入到画布中")
        return
    }
    left = left - containerRect.x + efContainer.scrollLeft
    top = top - containerRect.y + efContainer.scrollTop
    // 居中
    let x = left - 100
    let y = top - 20
    console.log(x, y);

    const docNode: DocNode = {
        id: UUID(),
        ...node,
        x, y,
        style: {
            top: y + 'px',
            left: x + 'px'
        }
    }
    console.log(docNode);

    nodeList.push(docNode)

    // 加载流程图
    function loadEasyFlow() {
        // 初始化节点
        for (var i = 0; i < nodeList.length; i++) {
            let node = nodeList[i]
            // 设置源点，可以拖出线连接其他节点
            jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
            // // 设置目标点，其他源点拖出的线可以连接该节点
            jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
            if (!node.viewOnly) {
                this.jsPlumb.draggable(node.id, {
                    containment: 'parent',
                    stop: function (el) {
                        // 拖拽节点结束后的对调
                        console.log('拖拽结束: ', el)
                    }
                })
            }
        }
        // 初始化连线
        for (var i = 0; i < this.data.lineList.length; i++) {
            let line = this.data.lineList[i]
            var connParam = {
                source: line.from,
                target: line.to,
                label: line.label ? line.label : '',
                connector: line.connector ? line.connector : '',
                anchors: line.anchors ? line.anchors : undefined,
                paintStyle: line.paintStyle ? line.paintStyle : undefined,
            }
            this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
        }
        this.$nextTick(function () {
            this.loadEasyFlowFinish = true
        })
    }
}
</script>
<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    // background-color: antiquewhite;
    position: relative;

    .node {
        position: absolute;
    }
}
</style>