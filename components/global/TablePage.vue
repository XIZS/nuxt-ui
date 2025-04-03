<template>
    <UDashboardPanel id="customers">
        <template #header>
            <UDashboardNavbar :title="props.navbar.title">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>

                <template #right>
                    <component :is="props.navbar.right"></component>
                </template>
            </UDashboardNavbar>
           
            <UTabs v-model="tabActiveKey" v-if="props.tabs?.length>1"  variant="link" :content="false" :items="tabsItems"  class="w-full" />
        </template>
        <template #body>
            <template v-if="props.tabs">
                <component v-for="(item,index) in tableList" :is="item" v-show="tabActiveKey == index" :key="index"></component>
            </template>
            <FormTable v-else  v-bind="props.body"></FormTable>
        </template>
    </UDashboardPanel>
</template>

<script setup lang="tsx">
import type { FormTableProps } from './FormTable.vue'
import type { TabsItem } from '@nuxt/ui'
import FormTable from './FormTable.vue'

// 使用泛型参数 T
const props = defineProps<TablePageProps<any>>() // 先用 any，实际使用时传入具体类型
console.log(props)

// const items = ref<TabsItem[]>([
//     {
//         label: 'Income Record',
//         icon: 'i-lucide-key',
//         value:0
//     },
//     {
//         label: 'Outcome Record',
//         icon: 'i-lucide-key',
//         value:1
//     }
// ])
const tabsItems = computed(()=>{
    return props.tabs?.map((item,index)=>{
        return {
            label:item.label,
            icon:item.icon,
            value:index
        }
    })??[]
})
const tabActiveKey = ref('0')

// 定义泛型参数 T
export interface TablePageProps<T> {
    navbar: {
        title: string | VNode
        right: VNode
    }
    tabs:{
        label:string,
        body:FormTableProps<T>
    }[]
    body: FormTableProps<T> // 假设 FormTableProps 是泛型接口
}



let tableList = asyncRef<any>(()=>{
    if(props.tabs?.length>1){

        return [h(FormTable,{...props.tabs[tabActiveKey.value].body}),]
    }
    return []
})

watch(tabActiveKey,(val)=>{
    if(tableList.value[tabActiveKey.value]==null){
        tableList.value[tabActiveKey.value] = h(FormTable,{...props.tabs[tabActiveKey.value].body})
    }
    console.log(tableList.value)
})

</script>