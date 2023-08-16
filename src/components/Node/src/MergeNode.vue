<template>
    <div id="root">
        <div v-show="mregeOption.showMergeView" id="merge-node">
            <div id="tip">
                拖动滑块对齐位置进行合并
            </div>
            <SlideBlock id="input1" :width="mregeOption.input1.width + 'px'" :style="{ left: mregeOption.input1.left + 'px' }"
                :index="1" @offsetChange="onDragEnd">
                <label>
                    拖动输入1
                </label>
            </SlideBlock>
            <SlideBlock id="input2" :width="mregeOption.input2.width + 'px'" :style="{ left: mregeOption.input2.left + 'px' }"
                :index="2" @offsetChange="onDragEnd">
                <label>
                    拖动输入2
                </label>
            </SlideBlock>


        </div>
    </div>
</template>
<script lang="ts" setup>
import useCommonStore from '@/store/common'
import { storeToRefs } from 'pinia';
import SlideBlock from './SlideBlock.vue';
const store = useCommonStore()
let { mregeOption } = storeToRefs(store)
function onDragEnd(index: number, left: number, right: number) {
    if (index == 1) {
        mregeOption.value.input1.left = left
        mregeOption.value.input1.right = right
    }
    if (index == 2) {
        mregeOption.value.input2.left = left
        mregeOption.value.input2.right = right
    }

}


</script>
<style scoped lang="scss">
#root {
    overflow-x: scroll;
    text-align: center;
    #merge-node {
        height: 85px;
        overflow: scroll;
        max-width: 5000;
        background-color: rgb(229, 140, 140);
        position: relative;
        line-height: 35px;
        color: #a2aaa1;

        #tip {
            height: 80px;
            line-height: 80px;
            font-size: 30px;
            font-weight: 800;
            color: #6c726b80;
            top: 0;
        }

        #input1 {
            top: 5px;
            margin: 0 10px;
            position: absolute;
            background-color: antiquewhite;
            height: 35px;
        }

        #input2 {
            bottom: 5px;
            margin: 0 10px;
            position: absolute;
            background-color: antiquewhite;
            height: 35px;
        }
    }
}
</style>
