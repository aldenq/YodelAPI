/**
 * InvalidFieldFieldArgs is thrown when invalid arguments are provided in the 
 * constructor for a {@linkcode Field} object.
 */
export class InvalidFieldArgs extends Error{
    /**@private*/
    constructor(bytesproblem:boolean){
        if(bytesproblem){
            super("Invalid Field Arguments: Must specify bytes, min/max, or arguments.");
        }else{
            super("Invalid Field Arguments: Cannot create bit-lookup for Field object not of type 'flags'.")
        }
        this.name = "InvalidFieldArgs";
    }

};
/**
 * UnkownGroup is thrown when a {@linkcode YodelSocket} tries to leave a group
 * that it is not a part of.
 * See {@linkcode YodelSocket.leaveGroup}
 */
export class UnkownGroup extends Error{
    /**@private*/
    constructor(group:string){
        
        super("Cannot leave group '"+group+"' because this YodelSocket is not a part of group '"+group+"'");
        this.name = "UnkownGroup";
    }
};
/**
 * ReservedValue is thrown when a user tries to use a value that is reserved for the api.
 * e.g: Setting the mtype of a {@linkcode Format} object to -127 (this number is reserved
 * for the API)
 */
export class ReservedValue extends Error{
    /**@private*/
    constructor(value:string, assignment:string){
        super("Invalid use of reserved value ["+value+"] in assignment to '"+assignment+"'.");
        this.name = "ReservedValue";
    }
}
/**
 * A YodelError is thrown when the yodel instance running on the API remote catches
 * a python error coming from yodel.
 */
export class YodelError extends Error{
    /**@private @internal*/
    constructor(message:string, name:string){
        super(message);
        this.name=name;
    }
}
/**
 * The APIConnectionError is thrown when a {@linkcode YodelSocket} has lost, or has not yet created its 
 * connection to the API remote (the server).
 */
export class APIConnectionError extends Error{
    /**@private @internal*/
    constructor(readystate:number){
        switch (readystate) {
            case WebSocket.CONNECTING:
                super("This Yodel Socket has not yet connected to the API remote.");
                break;
            case WebSocket.CLOSED:
                super("This Yodel Socket has lost connection to the API remote.");
                break;
            case WebSocket.CLOSING:
                super("This Yodel Socket is closing connection to the API remote.");
                break;
            default:
                super("This Yodel Socket does not have a connection to the API remote.");
                break;
        }
    }
}