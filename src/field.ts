import { InvalidFieldArgs } from "./errors";

export const enum FieldType{

    int,
    str,
    bytearray,
    flags

};

export class Field{
    name:string;
    type:FieldType;
    bytes:number;
    min:number = 0;
    max:number = 0;
    args:Array<string> = [];
    constructor(name:string, type:FieldType, bytes:number=0, min:number=0, max:number=0, args:Array<string> = []){
        this.name=name;
        this.type=type;
        this.bytes=bytes;
        this.min = min;
        this.max = max;
        this.args = args;

        if(bytes+min+max == 0){
            throw new InvalidFieldArgs(true);
        }else if (args.length > 0 && type != FieldType.flags){
            throw new InvalidFieldArgs(false);
        }
        

    }

};