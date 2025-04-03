import { UButton, UModal } from "#components"
import { createVNode } from "vue"
import type { FormType } from "~/components/global/XForm"


export const Modal = (el:any)=>{

    const overlay = useOverlay()
    let control:any = {}

    let com = defineComponent({
        setup(){
            let open = ref(false)
            control.close = ()=>{
                modal.close()
            }
            provide('modal:close',()=>{
                modal.close()
            })

            onMounted(()=>{
                open.value = true
            })

            return ()=> createVNode(el,{
                open:open.value,
                'onUpdate:open':(value:boolean)=>{
                    open.value = value
                }
            })
        }
    })

    const modal = overlay.create(com, {
        props: {
           
        }
    })
     modal.open()

    return {
        com,
        control
    }
}


export const FormModal = async(props:FormType&{title:string})=>{

    let {com:FormCom} = Form({...props})

    Modal(h(UModal,{
        title:props.title,
    },{
        'body':h('div',{},h(FormCom))
    }))
}

type ConfirmParamsType = {
    title?:string,
    description:string,
    content?:any
}

export const Confirm = async(params?:ConfirmParamsType)=>{
    return new Promise(async (resolve,reject)=>{
        let {control} = await Modal(h(UModal,{
            title:params?.title??'Confirm',
            description:'Are you sure you want to proceed?'
        },{
            'footer':h('div',{class:'flex justify-end space-x-2 w-full'},[
                h(UButton,{label:'Cancel',variant:'outline',onClick:()=>{
                    console.log(control)
                    reject()
                    control.close()
                }}),
                h(UButton,{label:'Confirm',onClick:()=>{
                    resolve(true)
                    control.close()
                }})
            ])
        }))
    })
}