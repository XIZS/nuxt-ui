<template>
    <div class="h-full gap-4 relative flex flex-col ">
        <div class="flex justify-between  items-center">
            <div  class="flex items-center flex-wrap gap-2">
                <component 
                    v-for="item in formComs"
                    :is="item.com" 
                    :form="form" 
                    :k="item.k" 
                    :label="item.label"
                ></component>
            </div>

            <div class="flex items-center ">
                <component 
                    v-for="item in actionComs"
                    :is="item" :form="form" :k="item.k" :label="item.label"
                ></component>
                <UButton @click="tableData.load()" :loading="tableData.loading" icon="cuida:loading-right-outline"  variant="outline"> </UButton>
            </div>
        </div>
        <UTable
            ref="table"
            :data="tableData.value"
            :columns="props.table.columns"
            :loading="tableData.loading"
            sticky
            :ui="{
                base: 'table-fixed border-separate border-spacing-0',
                thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                tbody: '[&>tr]:last:[&>td]:border-b-0',
                th: 'whitespace-nowrap py-2 mb-1 first:rounded-l-[calc(var(--ui-radius)*2)] last:rounded-r-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
                td: 'border-b border-(--ui-border)'
            }"
        />
        <div class="flex items-center justify-between gap-3 border-t border-(--ui-border) pt-4 mt-auto">
            <div class="text-sm text-(--ui-text-muted)">
            </div>

            <div class="flex items-center gap-1.5">
            <UPagination
                :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                :total="table?.tableApi?.getFilteredRowModel().rows.length"
                @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
            />
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

type ColumnType = {
    id?:string,
    label?:string,
    k:string,
    is:string,
}

export type FormType = {
    label:string,
    is:string,
    k:string,
}

export type FormTableProps<T> = {
    form?: FormType[]
    action?: VNode[]
    table: {
        columns: TableColumn<T>[]
        data: () => Promise<any[]>|any[]
    },
    control?:any
}

const props = defineProps<FormTableProps<any>>()


let debounceLoad = useDebounceFn(()=>{
    tableData?.load()
},500)

const form = ref({})
watch(form,(val)=>{
    debounceLoad()
},{
    deep:true
})
const formPreCom:any = {
    'input':defineAsyncComponent(()=>import('@/components/global/ft/input.vue'))
}
const actionPreComs:any = {
    'input':defineAsyncComponent(()=>import('@/components/global/ft/input.vue'))
}
const formComs = props.form.map((item)=>{
    return {
        ...item,
        com:formPreCom[item.is]
    }
})
const actionComs = props.form.map((item)=>{
    return {
        ...item,
        com:actionPreComs[item.is]
    }
})


let tableData = asyncReactive(async()=>{
    let res =  await props.table.data(form.value) 

    return res.data
},[])


console.log(props)
if(props.control){
    props.control.refresh = ()=>{
        console.log('refresh........')
        tableData.load()
    }
    console.log(props.control)
}

</script>

<style scoped></style>