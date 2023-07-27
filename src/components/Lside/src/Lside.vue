<template>
    <div class="l-side">
        <div class="menu" v-for="(sub, index) in items" :key="sub.key">
            <div class="menu-label" @click="menuClick(index)">
                {{ sub.label }}
            </div>
            <div v-if="sub.children" class="sub-menu">
                <draggable @end="onDragEnd" :list="sub.children" itemKey="label" :sort="false">
                    <template #item="{ element }">
                        <div class="menu-item" :id="element.key">
                            <Node :nodeData="element"></Node>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Node from '@/components/Node.vue';
import draggable from 'vuedraggable';
import { reactive, ref, toRaw } from 'vue';
import useCommonStore from '@/store/common'

const commonStore = useCommonStore()
const items = reactive(commonStore.menuItems)

let isClose = ref(true);
function menuClick(i: number) {
    const menus: NodeList = document.querySelectorAll(".menu")
    const submenu: ChildNode = menus[i].childNodes[1]
    if (isClose.value) {
        isClose.value = false
        submenu.className = "sub-menu"
    } else {
        submenu.className = "close"
        isClose.value = true

    }

}
function onDragEnd(e: any) {
    // console.log(e.originalEvent.clientX);
    // console.log(e.originalEvent.clientY);
    let id: String = e.item.id;

    const arr = toRaw(items)
    let node = null;
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
    commonStore.addNode(e, JSON.parse(JSON.stringify(node)));
    node = null
}
// onMounted(() => {
//     const els = document.getElementsByClassName("menu-item");
//     for (let index = 0; index < els.length; index++) {
//         const element = els[index];
//         useMove(element);
//     }
// })
</script>
<style scoped lang="scss">
.l-side {
    height: 100%;
    overflow: auto;
}

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
        margin: 10px 20px;
    }

}

.open {
    height: auto;
}

.close {
    display: none;
}

.ghost {
    border: solid 1px rgb(19, 41, 239);
}

.chosenClass {
    background-color: #f1f1f1;
}
</style>
  
  