import { Field, FieldType } from "./field"


export class Format{

    fields: Array<Field>;
    mtype: number = 0;
    constructor(fields:Array<Field>, mtype:number=0){
        this.fields=fields;
        this.mtype = mtype;
    }

    stringify(){
        return JSON.stringify(
            {"fields":this.fields.toString(), "mtype":this.mtype}
        );
    }


};