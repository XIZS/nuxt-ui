import * as z from 'zod'
import { UButton, UForm, UFormField, UInput } from '#components'

type FieldType = {
    label:string,
    is:string,
    k:string,
    v?:any,
    schema?:any,
    bind?:any,
    show?:boolean
}
type FieldsType = FieldType[]|FieldType[][]|((form:any)=>FieldType[]|FieldType[][])

export type FormType = {
    fields:FieldsType,
  
}


export default defineComponent({
    props:{
        fields: {
            type: Array as PropType<FieldsType>, // 使用 PropType 来指定类型
            required: true, // 如果 field 是必传的
        },
        formData:{
            type:Object as PropType<any>,
        },
        submit:{
            type:Function,
            required:true
        }
    },
    setup(props){

      
        const schema = z.object(ADParse(props.fields,{}).reduce((prev:any,next)=>{
            if(next.show!=null&&next.show===false){
                return prev
            }
            if(Array.isArray(next)){
                next.forEach(subItem=>{
                    prev[subItem.k] = subItem.schema
                })

            }else{
                prev[next.k] = next.schema
            }
            return prev
        },{})) 


        const state = reactive(ADParse(props.fields,{}).reduce((prev:any,next:any)=>{
            if(Array.isArray(next)){
                next.forEach(subItem=>{
                    prev[subItem.k] = props.formData?.[subItem.k] ?? subItem.v?? undefined
                })
            }
            prev[next.k] = props.formData?.[next.k] ?? next.v?? undefined
            return prev
        },{}))

        let modalClose = inject('modal:close',()=>{})


        let labels = computed(()=>{
            return ADParse(props.fields,state).map(item=>{
                if(Array.isArray(item)){
                    return item.map(subItem=>{
                        if(subItem.show==null||subItem.show==true){
                            return subItem
                        }
                    }).filter(item=>item!=null)
                }else{
                    if(item.show==null||item.show==true){
                        return item
                    }
                }
            }).filter(item=>item!=null)
        })

        let fieldCom:any = {
            input:(field:FieldType)=><UInput class="w-full" v-model={state[field.k]}></UInput>,
            textarea:(field:FieldType)=><UInput class="w-full" v-model={state[field.k]}></UInput>,
            text:(field:FieldType)=><UInput disabled={true} class="w-full" v-model={state[field.k]}></UInput>,
        }

        const getFieldCom =(field:FieldType)=>{
            return fieldCom[field.is](field)
        }

        const renderLabel = (field:FieldType)=>{
            return <UFormField  required={field.schema!=null} class="flex-1" label={field.label} name={field.k}>
                        {getFieldCom(field)}
                    </UFormField>
        }

        return ()=><>
            <UForm
                schema={schema}
                state={state}
                class="gap-4 flex flex-col "
                onSubmit={async (form)=>{
                    await props.submit(form.data)
                    modalClose()
                }}
            >
                {labels.value.map(item=>{
                    if(Array.isArray(item)){
                        return  <UForm schema={schema} state={state} class="flex items-start space-x-2">
                            {item.map(subItem=>{
                                return renderLabel(subItem)
                            })}
                        </UForm>
                    }else{
                        return renderLabel(item)
                    }
                })}
                <div class="flex justify-end space-x-2">
                    <UButton variant='outline' onClick={()=>{
                        modalClose()
                    }}>Cancle</UButton>
                    <UButton type="submit" >Submit</UButton>
                </div>
            </UForm>
        </>
    }
})