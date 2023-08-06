<template>
    <div id="container">
        <div id="sidebar"></div>
        <a-layout-sider breakpoint="xl" :collapsedWidth="0" :width="pos.x">
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
        </a-layout-sider>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, toRaw, onMounted } from 'vue';
import type { Ref, UnwrapRef } from 'vue';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
import { cloneDeep } from 'lodash';
import useCommonStore from '@/store/common'
import { storeToRefs } from 'pinia';
import { DocNodeData } from '@/types';
import useMove from '@/util/useMove';
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
let pos = reactive({ x: 250, y: 0 })
// watch(pos, function (newData) {
//     console.log(newData.x);

// })
onMounted(() => {
    useMove(document.getElementById("sidebar"), pos)
})
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

</script>
<style lang="scss" scoped>
#container {
    display: flex;
    background-color: white;
    height: 100%;

    #sidebar {
        border-radius: 10px;
        z-index: 1000;
        height: 50px;
        align-self: center;
        width: 20px;
        margin-right: 8px;
        background-color: rgba(27, 123, 248, 0.438);
        overflow: hidden;
    }

    #sidebar:hover {
        margin-right: 10px;
        background-color: rgb(39, 76, 243);
        cursor: move;
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
  