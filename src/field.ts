import { InvalidFieldArgs } from "./errors";

export class FieldType{

    static int:number = 0;
    static str:number = 1;
    static bytearray:number = 2;
    static flags:number = 3;

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

    stringify(){
        return JSON.stringify(this)
    }

};