import { XForm as FormCom } from "#components";
import { createVNode } from "vue";
import type { FormType } from "../components/global/XForm";

export const Form = (props:FormType)=>{
    let com = ()=> createVNode(FormCom,props)
    return {
       com
    }
}