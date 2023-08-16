<template>
    <div id="container" :collapsedWidth="0" :style="sideStyle">
        <div class="drag-bar" @mousedown="startDrag"></div>
        <a-table size="small" class="root" :pagination="false" bordered :data-source="dataSource" :columns="columns">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'value' && record.editable">
                    <a-input @change="change($event, record)" :value="showValue(record)" :placeholder="String(text)" />

                </template>
                <template v-else-if="column.dataIndex === 'key'">
                    <label class="editable-cell-key ellipsis">
                        {{ record.label }}
                    </label>
                </template>
                <template v-else>
                    {{ showValue(record) }}
                </template>
            </template>
        </a-table>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, toRaw, Ref } from 'vue';
import useCommonStore from '@/store/common'
import { storeToRefs } from 'pinia';
import { DocNodeData } from '@/types';
// import useMove from '@/util/useMove';
const store = useCommonStore()
interface DataItem {
    label: string,
    key: string,
    value: string,
    editable?: boolean,
    type?: string
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
function showValue(record: DataItem) {
    let value = activeNode.value[record.key]
    if (value == null) {
        return "NULL"
    }
    if (value == undefined) {
        return "UNDEFINE"
    }
    if (value instanceof Array)
        return value.join(',')
    if (value instanceof File)
        return value.name
    return value
}
watch(activeNode, function (newData) {
    dataSource.value.splice(0, dataSource.value.length)
    const properties = toRaw<DocNodeData>(newData).properties
    const customProperties = toRaw<DocNodeData>(newData).customProperties
    properties?.forEach((property) => {
        dataSource.value.push({ key: property.name, value: newData[property.name], ...property })
    })
    customProperties?.forEach((property) => {
        dataSource.value.push({ key: property.name, value: newData[property.name], ...property })
    })    
},{deep:true})

function change(event: Event, data: DataItem) {
    const target = event.target as HTMLInputElement
    if (!target) return
    if (target.type == 'file') {
        if (!target.files) return
        let file = target.files[0]
        activeNode.value.file = file.name
        activeNode.value.fileName = file.name
        store.wavedata.file = file
        return
    }
    activeNode.value[data.key] = target.value
}

let startX = 0
const sideStyle = reactive({
    width: "300px"
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

    .ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
            color: #108ee9;
        }

        .editable-cell-icon {
            margin-top: 4px;
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
  