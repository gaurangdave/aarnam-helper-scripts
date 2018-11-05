export declare class ServiceResponse {
    private _type;
    private _name;
    private _message;
    private _data;
    constructor(type?: string, name?: string, message?: string, data?: any);
    static createErrorResponse(_name?: string, _message?: string, _data?: any): ServiceResponse;
    static createSuccessResponse(_name?: string, _message?: string, _data?: any): ServiceResponse;
    static createWarningResponse(_name?: string, _message?: string, _data?: any): ServiceResponse;
    type: string;
    name: string;
    message: string;
    data: any;
}
