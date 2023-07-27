<template>
    <a-tabs v-model:activeKey="activeKey" type="editable-card" @edit="onEdit">
        <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
            <div class="content">
                <Background>
                    <slot></slot>
                </Background>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Background from './Background.vue';

const panes = ref<{ title: string; content: string; key: string; closable?: boolean }[]>([

    { title: '任务1', content: '', key: '1', closable: false },
]);

const activeKey = ref(panes.value[0].key);

const newTabIndex = ref(0);

const add = () => {
    activeKey.value = `newTab${++newTabIndex.value}`;
    panes.value.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey.value });
};

const remove = (targetKey: string) => {
    let lastIndex = 0;
    panes.value.forEach((pane, i) => {
        if (pane.key === targetKey) {
            lastIndex = i - 1;
        }
    });
    panes.value = panes.value.filter(pane => pane.key !== targetKey);
    if (panes.value.length && activeKey.value === targetKey) {
        if (lastIndex >= 0) {
            activeKey.value = panes.value[lastIndex].key;
        } else {
            activeKey.value = panes.value[0].key;
        }
    }
};

const onEdit = (targetKey: string | MouseEvent, action: string) => {
    if (action === 'add') {
        add();
    } else {
        remove(targetKey as string);
    }
};
</script>
  
<style scoped>
.content {
    margin: 0;
    height: calc(100vh - 170px);
    z-index: 1;
    overflow: scroll;
}
</style>