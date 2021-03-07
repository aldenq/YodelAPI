import { Field, FieldType } from "./field"


export class Format{

    fields: Array<Field>;

    constructor(fields:Array<Field>, mtype=0){
        this.fields=fields;
    }


};