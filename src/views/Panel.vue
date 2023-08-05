<template>
    <!-- <a-layout class="container"> -->
    <!--         
        <a-layout-header>
            <Header></Header>
        </a-layout-header> -->

    <!-- <a-layout>
            <a-layout-sider breakpoint="sm" :collapsedWidth="80" width="200" class="lside">
                <Lside></Lside>
            </a-layout-sider>
            <a-layout-content id="content">
                <Documention></Documention>
            </a-layout-content>
            <a-layout-sider breakpoint="sm" :collapsedWidth="20" width="250" class="lside">
                <Rside></Rside>
            </a-layout-sider>
        </a-layout>
        <a-layout-footer class="footer">
            <Wave></Wave>
        </a-layout-footer>
    </a-layout> -->
    <a-layout class="container">
        <a-layout-sider class="lside">
            <Lside></Lside>
        </a-layout-sider>
        <a-layout-content class="content">
            <a-layout class="center">
                <Documention></Documention>
                <Rside></Rside>
            </a-layout>
            <a-layout class="footer">
                <Wave></Wave>
            </a-layout>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import { Documention } from '@/components/Document'
import { Lside, Rside } from '@/components/ASide'
import { Wave } from '@/components/Footer'
// import { Header } from '@/components/Header'
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
    background-color: white;
    height: 100vh;

    .footer {}

    .content {
        display: flex;
        height: 100%;
        flex-direction: column;

        .footer {
            flex-grow: 0;
        }

        .center {
            flex-grow: 1;
            flex-direction: row;
            display: flex;

            .rslide {

                height: 100%;
                background-color: white;
            }
        }
    }

    .lside {
        background-color: white;
    }
}
</style>
  
  