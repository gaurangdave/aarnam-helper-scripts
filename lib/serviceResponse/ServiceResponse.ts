const serviceResponseTypes = require("../constants/service_response");
export class ServiceResponse {
    private _type: string;
    private _name: string;
    private _message: string;
    private _data: any;

    constructor(
        type: string = serviceResponseTypes.TYPES.ERROR,
        name: string = serviceResponseTypes.UNKNOWN_ERROR,
        message: string = serviceResponseTypes.UNKNOWN_ERROR,
        data: any = null
    ) {
        this._type = type;
        this._name = name;
        this._message = message;
        this._data = data;
    }

    static createErrorResponse(
        _name: string = serviceResponseTypes.UNKNOWN_ERROR,
        _message: string = serviceResponseTypes.UNKNOWN_ERROR,
        _data: any = null
    ): ServiceResponse {
        return new ServiceResponse(
            serviceResponseTypes.TYPES.ERROR,
            _name,
            _message,
            _data
        );
    }

    static createSuccessResponse(
        _name: string = serviceResponseTypes.TYPES.SUCCESS,
        _message: string = serviceResponseTypes.TYPES.SUCCESS,
        _data: any = null
    ): ServiceResponse {
        return new ServiceResponse(
            serviceResponseTypes.TYPES.SUCCESS,
            _name,
            _message,
            _data
        );
    }

    static createWarningResponse(
        _name: string = serviceResponseTypes.TYPES.WARNING,
        _message: string = serviceResponseTypes.TYPES.WARNING,
        _data: any = null
    ): ServiceResponse {
        return new ServiceResponse(
            serviceResponseTypes.TYPES.WARNING,
            _name,
            _message,
            _data
        );
    }
    /**
     * Getter type
     * @return {string}
     */
    public get type(): string {
        return this._type;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter message
     * @return {string}
     */
    public get message(): string {
        return this._message;
    }

    /**
     * Getter data
     * @return {any}
     */
    public get data(): any {
        return this._data;
    }

    /**
     * Setter type
     * @param {string} value
     */
    public set type(value: string) {
        this._type = value;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter message
     * @param {string} value
     */
    public set message(value: string) {
        this._message = value;
    }

    /**
     * Setter data
     * @param {any} value
     */
    public set data(value: any) {
        this._data = value;
    }
}

// module.exports = ServiceResponse;
