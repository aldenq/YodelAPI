export class InvalidFieldArgs extends Error{

    constructor(bytesproblem:boolean){
        if(bytesproblem){
            super("Invalid Field Arguments: Must specify bytes, min/max, or arguments.");
        }else{
            super("Invalid Field Arguments: Cannot create bit-lookup for Field object not of type 'flags'.")
        }
        this.name = "InvalidFieldArgs";
    }

};