<template>
    <div class="background">
        <TabContent>
            <Content></Content>
        </TabContent>
    </div>
</template>
    
<script setup>
import TabContent from './TabContent.vue';
import Content from './Content.vue';


</script>
    
<style lang="scss" scoped>
.background {
    // z-index: 1;
    // height: 100%;
    // width: 100%;
    overflow: hidden;
}
</style>
    