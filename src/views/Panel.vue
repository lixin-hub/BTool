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
        </a-layout>
        <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
</template>
<script lang="ts" setup>
import { Documention } from '@/components/Document'
import { Lside } from '@/components/Lside'
import { Header } from '@/components/Header'

</script>
<style lang="scss" scoped>
.container {
    height: 100vh;

    .lside {
        background-color: white;
    }
}
</style>
  
  