import { InvalidFieldArgs } from "./Errors";
import { bytesToRepresent } from "./Utilities";
/**
 * FieldType is an enumeration of normal python types.
 */
export class FieldType{
    /**The 'int' type from python */
    static int:number = 0;
    /**The 'str' type from python */
    static str:number = 1;
    /**The 'bytearray' type from python */
    static bytearray:number = 2;
    /**The yodel.flags type from yodel */
    static flags:number = 3;
};
/**
 * A Field is used to encode one part of a {@linkcode Format}.
 * Each field is given a name, and some typing information. A field's purpose
 * is not to actually store values, but rather to them a key (as in a JSON key, value pair),
 * and some extra metadata for yodel.
 */
export class Field{
    /**
     * The name of a field is used as the JSON key for accessing the field's
     * value in a {@linkcode Section}.
     */
    name:string;
    /**
     * What catagory of type this field must be. The field's type gets its origin from
     * python types, which are enumerated by {@linkcode FieldType}. 
     * The value of type must be {@linkcode FieldType.int}, {@linkcode FieldType.str}, {@linkcode FieldType.bytearray}, or {@linkcode FieldType.flags}
     */
    type:FieldType;
    /**
     * The maximum number of bytes that this field may use.
     */
    bytes:number;
    /**
     * For some field types this will always be zero.
     * For {@linkcode FieldType.int}, min is the minimum value that this field may be.
     */
    min:number = 0;
    /**
     * For any field other than an 'int' type field, this will equal bytes.
     * For {@linkcode FieldType.int}, max is the maximum value that this field can be.
     */
    max:number = 0;
    /**
     * This will by empty unless this field is of type {@linkcode FieldType.flags}
     */
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