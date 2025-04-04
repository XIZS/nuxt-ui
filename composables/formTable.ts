import TablePageCom from "../components/global/TablePage.vue";
import FormTableCom from "../components/global/FormTable.vue";
import {PostgrestFilterBuilder} from "@supabase/postgrest-js";
import type { FormTableProps, FormType } from "../components/global/FormTable.vue";
import type { TablePageProps } from "../components/global/TablePage.vue";


export const FormTable = <T>(props:FormTableProps<T>)=>{

    const control = {refresh:()=>{}}

    return {
        com:h(FormTableCom,{
            form:[],
            action:[],
            ...props,
            control
        }),
        control
    }
}


export const SbFormTable = <T>(props:FormTableProps<T>)=>{
    return FormTable({
        ...props,
        table:{
            ...props.table,
            data:async (params:any)=>{
                let {page,pageSize,...formData} = params
                let query = props.body.table.query(formData)

                props.body.form.forEach(item=>{
                    if(item.query){
                        item.query({query,value:formData[item.k],key:item.k,formData})
                    }
                })

                let start = (page-1)*pageSize
                let end = start+pageSize-1
                // query.range(start,end)

                // query.select('*',{count:"exact"})

                let {data,count} = await query
                console.log(data,count) 
                return {
                    count:count,
                    data:data??[]
                }
            }
        }
    })
}

export const TablePage = <T>(props:TablePageProps<T>)=>{
    console.log(props)

    const control = {refresh:()=>{}}

    return {
        com:h(TablePageCom,{
            ...props,
            navbar:props.navbar,
            body:{
                ...props.body,
                control
            }
        }),
        control
    }
}


type formQuery = {
    query:PostgrestFilterBuilder<any,any,any>,
    value:any,
    key:string,
    formData:any
}

type SbTablePageProps<T> = TablePageProps<T>&{
    body:{
        form:(FormType&{query?:(params:formQuery)=>void})[]
        table:{
            query:(form:any)=>any
            data?:(params:any)=>Promise<{count:number,data:T[]}>|undefined
        },
    }
}

export const SbTablePage = <T>(props:SbTablePageProps<T>)=>{


    return TablePage({
        ...props,
        navbar:props.navbar,
        body:{
            ...props.body,
            table:{
                ...props.body.table,
                data:async (params:any)=>{
                    let {page,pageSize,...formData} = params
                    let query = props.body.table.query(formData)

                    props.body.form.forEach(item=>{
                        if(item.query){
                            item.query({query,value:formData[item.k],key:item.k,formData})
                        }
                    })

                    let start = (page-1)*pageSize
                    let end = start+pageSize-1
                    // query.range(start,end)

                    // query.select('*',{count:"exact"})

                    let {data,count} = await query
                    console.log(data,count) 
                    return {
                        count:count,
                        data:data??[]
                    }
                }
            }
        }
    })
}