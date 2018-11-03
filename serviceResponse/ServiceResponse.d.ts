export declare class ServiceResponse {
    private _type;
    private _name;
    private _message;
    private _data;
    constructor(type?: string, name?: string, message?: string, data?: any);
    static createErrorResponse(_name?: string, _message?: string, _data?: any): ServiceResponse;
    static createSuccessResponse(_name?: string, _message?: string, _data?: any): ServiceResponse;
    static createWarningResponse(_name?: string, _message?: string, _data?: any): ServiceResponse;
    /**
     * Getter type
     * @return {string}
     */
    /**
    * Setter type
    * @param {string} value
    */
    type: string;
    /**
     * Getter name
     * @return {string}
     */
    /**
    * Setter name
    * @param {string} value
    */
    name: string;
    /**
     * Getter message
     * @return {string}
     */
    /**
    * Setter message
    * @param {string} value
    */
    message: string;
    /**
     * Getter data
     * @return {any}
     */
    /**
    * Setter data
    * @param {any} value
    */
    data: any;
}
