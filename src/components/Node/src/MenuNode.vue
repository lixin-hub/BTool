
<template>
    <div class="node" ref="root">
        <label class="icon">
            <star-two-tone two-tone-color="#eb2f96" />
        </label>
        <label class="label">{{ nodeData.label }}</label>
    </div>
</template>
<script lang="ts" setup>
import { StarTwoTone } from '@ant-design/icons-vue';
import { MenuNodeData } from '@/types';
defineProps<{ nodeData: MenuNodeData }>()
</script>
<style scoped>
.icon {
    padding-left: 10;
    width: 20px;
    height: 20px;
}

.label {
    padding-left: 20px;
}

.node {
    width: 200px;
    color: white;
    line-height: 40px;
    background-color: goldenrod;
    border-radius: 5px;
    height: 40px;
    position: relative;
}
</style>