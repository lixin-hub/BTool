<template>
    <div class="container" :style="sideStyle">
        <div class="l-side">
            <div class="menu" v-for="(sub, index) in items" :key="sub.key">
                <div class="menu-label" @click="menuClick(index)">
                    {{ sub.label }}
                </div>
                <div v-if="sub.children" class="sub-menu">
                    <draggable @end="onDragEnd" :list="sub.children" itemKey="label" :sort="false">
                        <template #item="{ element }">
                            <div class="menu-item" :id="element.key">
                                <MenuNode :nodeData="element">
                                </MenuNode>
                            </div>
                        </template>
                    </draggable>
                </div>
            </div>
        </div>
        <div class="drag-bar" @mousedown="startDrag"></div>
    </div>
</template>
<script lang="ts" setup>
import { MenuNode } from '@/components/Node';
import draggable from 'vuedraggable';
import { cloneDeep } from 'lodash';
import { reactive, ref, toRaw } from 'vue';
import useCommonStore from '@/store/common'
import pubsub from 'pubsub-js'
import { Topics } from '@/types';
const commonStore = useCommonStore()
const items = reactive(commonStore.menuItems)

let isClose = ref(true);
function menuClick(i: number) {
    const menus: NodeList = document.querySelectorAll(".menu")
    const submenu = menus[i].childNodes[1] as HTMLElement
    if (isClose.value) {
        isClose.value = false
        submenu.className = "sub-menu"
    } else {
        submenu.className = "close"
        isClose.value = true

    }

}
function onDragEnd(e: any) {
    let id: String = e.item.id;
    const arr = toRaw(items)
    let node = null;
    //根据id(key)找到节点
    for (let index = 0; index < arr.length; index++) {
        if (node) { break }
        const element = arr[index];
        if (element.children) {
            for (let j = 0; j < element.children.length; j++) {
                const e = element.children[j];
                if (e.key === id) {
                    node = e;
                    break;
                }
            }
        }

    }
    if (!node) return
    pubsub.publish(Topics.NODE_ADD, { evt: e, node: cloneDeep(node) })
    node = null
}
let startX = 0
const sideStyle = reactive({
    width: "190px"
})

const startDrag = (e: { clientX: number; }) => {
    startX = e.clientX;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
};

const drag = (e: { clientX: number; }) => {
    const offsetX = -startX + e.clientX;
    sideStyle.width = Number.parseInt(sideStyle.width) + offsetX + 'px';
    startX = e.clientX;

};

const stopDrag = () => {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
};

</script>
<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: row;
    background-color: white;
    height: 100%;
    overflow: scroll;

    .l-side {
        flex-grow: 1;
        height: 100%;
        overflow: auto;
        background-color: white;

        .menu {

            .menu-label {
                height: 40px;
                width: 100%;
                padding-left: 20px;
                line-height: 40px;
                background-color: gray;
                border-bottom: 1px black solid;
            }

            .menu-item {
                // width: 99%;
                width: 150px;
                margin: 10px 20px;
            }

        }
    }

    .drag-bar {
        flex-grow: 0;
        flex-shrink: 0;
        width: 10px;
        z-index: 1000;
        border-radius: 5px;
        height: 250px;
        // top: 50px;
        background-color: #c2177b;
        cursor: ew-resize;
    }

}
</style>
  
  