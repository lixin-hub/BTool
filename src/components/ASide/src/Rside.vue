<template>
    <div id="container" :collapsedWidth="0" :style="sideStyle">
        <div class="drag-bar" @mousedown="startDrag"></div>
        <a-table size="small" class="root" :pagination="false" bordered :data-source="dataSource" :columns="columns">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'value' && record.editable">
                    <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                            <a-input v-model:value="editableData[record.key].value" @pressEnter="save(record.key)" />
                            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                            <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
                        </div>
                    </div>
                </template>
                <template v-else-if="column.dataIndex === 'key'">
                    <label class="editable-cell-key">
                        {{ record.key }}
                    </label>
                </template>
            </template>
        </a-table>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, toRaw } from 'vue';
import type { Ref, UnwrapRef } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash';
import useCommonStore from '@/store/common'
import { storeToRefs } from 'pinia';
import { DocNodeData } from '@/types';
// import useMove from '@/util/useMove';
const store = useCommonStore()
interface DataItem {
    key: string;
    value: string;
    editable?: boolean
}

const columns = [
    {
        title: '属性',
        dataIndex: 'key',
    },
    {
        title: '值',
        dataIndex: 'value',
    },
];
const dataSource: Ref<DataItem[]> = ref([]);
const { activeNode } = storeToRefs(store)
watch(activeNode, function (newData) {
    dataSource.value.splice(0, dataSource.value.length)
    const temp = toRaw<DocNodeData>(newData)
    for (const key in temp) {
        if (Object.prototype.hasOwnProperty.call(temp, key)) {
            const value = temp[key as keyof DocNodeData]; // 使用索引类型查询语法
            const objString = JSON.stringify(value, (_key, value) => {
                if (typeof value === "function") {
                    return value.toString(); // 将函数转换为字符串
                }
                return value; // 其他情况保持不变
            });
            dataSource.value.push({ key, value: objString })
        }
    }
})


const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

const edit = (key: string) => {
    editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};
const save = (key: string) => {
    Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
    delete editableData[key];
};
let startX = 0
const sideStyle = reactive({
    width: "200px"
})

const startDrag = (e: { clientX: number; }) => {
    startX = e.clientX;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
};

const drag = (e: { clientX: number; }) => {
    const offsetX = startX - e.clientX;
    sideStyle.width = Number.parseInt(sideStyle.width) + offsetX + 'px';
    startX = e.clientX;
};

const stopDrag = () => {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
};

</script>
<style lang="scss" scoped>
#container {
    display: flex;
    flex-direction: row;
    background-color: white;
    height: 100%;
    overflow: scroll;

    .drag-bar {
        flex-shrink: 0;
        right: 100px;
        width: 10px;
        z-index: 1000;
        border-radius: 5px;
        height: 250px;
        background-color: #cf0c0c;
        cursor: ew-resize;
    }

    .root {

        flex-grow: 1;
        width: 100%;
        height: 100%;
        background-color: white;
        overflow: scroll;

    }

    .editable-cell-key {
        height: 100%;
    }

    .editable-cell {
        position: relative;
        color: #108fe9;

        .editable-cell-input-wrapper,
        .editable-cell-text-wrapper {
            padding-right: 24px;
        }

        .editable-cell-text-wrapper {
            padding: 5px 24px 5px 5px;
            padding: 0;
        }

        .editable-cell-icon,
        .editable-cell-icon-check {
            position: absolute;
            right: 0;
            width: 20px;
            cursor: pointer;
        }

        .editable-cell-icon {
            margin-top: 4px;
            display: none;
        }

        .editable-cell-icon-check {
            line-height: 28px;
        }

        .editable-cell-icon:hover,
        .editable-cell-icon-check:hover {
            color: #108ee9;
        }

        .editable-add-btn {
            margin-bottom: 8px;
        }
    }

    .editable-cell:hover .editable-cell-icon {
        display: inline-block;
    }
}
</style>
  