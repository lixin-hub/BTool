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
    <div class="container">
        <div class="main">
            <Lside class="lside"></Lside>
            <a-layout-content class="content">
                <a-layout class="center">
                    <Documention></Documention>
                </a-layout>
                <a-layout class="footer">
                </a-layout>
            </a-layout-content>
        </div>

    </div>
</template>
<script lang="ts" setup>

import { Documention } from '@/components/Document'
// import { Header } from '@/components/Header'
import { onMounted, onUnmounted } from 'vue';
import pubsub from "pubsub-js";
import { ShortCut } from "@/types";
import { getWasmCoreWasm } from '@/util/FetchUtil';
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
onMounted(async () => {
    window.addEventListener('keydown', handleKeyDown)
    await getWasmCoreWasm()
})
onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
})
</script>
<style lang="scss" scoped>
.container {
    background-color: white;
    height: 100vh;
    width: 100vw;
    // overflow: hidden;
    overflow: scroll;
    display: flex;
    flex-direction: column;

    .main {
        height: 100%;
        display: flex;
        flex-direction: row;

        .lside {
            display: flex;
            flex-direction: row;
            flex-shrink: 0;
        }

        .content {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            flex-shrink: 1;


            .footer {
                flex-shrink: 0;
                flex-grow: 0;
            }
        }

    }

}
</style>
  
  