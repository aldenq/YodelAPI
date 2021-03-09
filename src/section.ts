import { Field } from "./field";
import {Format} from "./format"

export class Section{
    format:Format;
    fields:any = {};
    payload:string = "";

    constructor(fmt:Format, fields = {}, payload=""){
        this.format=fmt;
        this.fields = fields;
        this.payload = payload;
    }

    getField(key:string):any {
        return this.fields[key];
    }

    stringify():string{
        return JSON.stringify(this);
    }
};