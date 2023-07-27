<template>
    <!-- 外层盒子设置整体背景渐变蓝色 -->
    <div class="big-bg">
        <!-- 内层盒子铺满网格 -->
        <div class="inner-bg">
            <slot></slot>
        </div>
    </div>
</template>
    
<script setup lang="ts">

</script>
    
<style lang="scss" scoped>
.big-bg {
    width: calc(100% + 500px);
    height: calc(100% + 500px);
    background: linear-gradient(251.54deg,
            #1f75ad -10.05%,
            #194061 47.56%,
            #152439 100.71%);
}

.inner-bg {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(90deg,
            rgba(33, 233, 252, 0.12) 1%,
            rgba(0, 0, 0, 0) 5%),
        linear-gradient(rgba(33, 233, 252, 0.12) 1%, rgba(0, 0, 0, 0) 5%);
    background-size: 28px 28px;
}
</style>
    