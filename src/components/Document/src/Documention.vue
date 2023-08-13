<template>
    <div class="root">
        <div class="container">
            <div class="center">
                <div class="content">
                    <TabContent>
                        <Content></Content>
                    </TabContent>
                </div>
                <div class="right">
                    <Rside></Rside>
                </div>
            </div>
            <div class="bottom">
                <!-- <Wave></Wave> -->
                <div id="wave"></div>
            </div>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import TabContent from './TabContent.vue';
import Content from './Content.vue';
import { Rside } from '@/components/ASide'

</script>
    
<style lang="scss" scoped>
.root {
    height: 100%;
    width: 100%;
}

.container {
    display: flex;
    flex-direction: column;
    // z-index: 1;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .content {
        height: 100%;
        flex-grow: 1;
        overflow: scroll;
    }


    .center {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .bottom {
        background-color: #fdffff;

    }
    #wave{
        height: 100%;
    }

    .right {
        flex-grow: 0;
        flex-shrink: 0;
        height: 100%;
    }
}
</style>
    