import { ValidationError } from "./ValidationError";
import { TypeError } from "./ValidationError";

export class HTTPValidationError{
    detail: ValidationError[];
    constructor(location: string, message: string, type: TypeError){
        this.detail = [new ValidationError(location, message, type)];
    }
}