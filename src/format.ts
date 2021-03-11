import { Field, FieldType } from "./field"

/**
 * A Format object is used to classify a new type of message that will be sent over yodel.
 * A Format consists of a series of {@linkcode Field} objects, which depict a single key-value pair, 
 * and a single type id called {@linkcode Format.mtype}. 
 * A Format object is used to construct a {@linkcode Section} object, which can be sent through yodel. 
 */
export class Format{
    
    /**The {@linkcode Field} objects that define this new type*/
    fields: Array<Field>;
    /**An identifier for this type*/
    mtype: number = 0;

    /**
     * Construct a new {@linkcode Format} object.
     * @param fields The {@linkcode Field} objects that define this new type
     * @param mtype The identifier for this type (must sync between yodel participants)
     */
    constructor(fields:Array<Field>, mtype:number=0){
        this.fields=fields;
        this.mtype = mtype;
    }


};