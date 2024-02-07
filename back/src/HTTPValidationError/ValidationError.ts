export enum TypeError{
    AUTH_ERROR = 'AuthorizationError',
    LINK_ERROR = 'LinkError'
}

export class ValidationError{
    loc: string;
    msg: string;
    type: TypeError;
    constructor(location: string, message: string, type: TypeError ){
        this.loc = location;
        this.msg = message;
        this.type = type;
    }
}