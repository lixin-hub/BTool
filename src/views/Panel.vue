<template>
    <a-layout class="container">
        <a-layout-header>
            <Header></Header>
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="250" class="lside">
                <Lside></Lside>
            </a-layout-sider>
            <a-layout-content>
                <Documention></Documention>
            </a-layout-content>
            <a-layout-sider width="250" class="lside">
                <Rside></Rside>
            </a-layout-sider>
        </a-layout>
        <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
</template>
<script lang="ts" setup>
import { Documention } from '@/components/Document'
import { Lside, Rside } from '@/components/ASide'
import { Header } from '@/components/Header'
import { onMounted, onUnmounted } from 'vue';
import pubsub from "pubsub-js";
import { ShortCut } from "@/types";
function handleKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.code === 'KeyD') {
        pubsub.publish(ShortCut.KEY_CTRL_D)
        event.preventDefault()
        return
    }
    if (event.code === 'Delete') {
        pubsub.publish(ShortCut.KEY_DELETE)
        event.preventDefault()
        return
    }
    if (event.ctrlKey && event.code === 'KeyC') {
        pubsub.publish(ShortCut.KEY_CTRL_C)
        event.preventDefault()
        return
    }
    if (event.ctrlKey && event.code === 'KeyV') {
        pubsub.publish(ShortCut.KEY_CTRL_V)
        event.preventDefault()
        return
    }


}
onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss" scoped>
.container {
    height: 100vh;

    .lside {
        background-color: white;
    }
}
</style>
  
  