<template>
    <a-row align="middle" justify="space-between">
        <a-col :span="2">
            <div class="grid-content ">LOGO</div>
        </a-col>
        <a-col :span="2">
            <div class="grid-content ">LoGINs</div>
        </a-col>

    </a-row>
</template>
<script lang="ts" setup>

</script>
<style lang="scss">
.el-row {
    height: 100%;
    width: 100%;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
    background-color: aquamarine;
}
</style>