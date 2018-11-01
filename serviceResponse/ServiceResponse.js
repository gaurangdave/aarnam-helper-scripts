"use strict";
const serviceResponseTypes = require("../constants/service_response.json");
class ServiceResponse {
    constructor(type = serviceResponseTypes.TYPES.ERROR, name = serviceResponseTypes.UNKNOWN_ERROR, message = serviceResponseTypes.UNKNOWN_ERROR, data = null) {
        this._type = type;
        this._name = name;
        this._message = message;
        this._data = data;
    }
    static createErrorResponse(_name = serviceResponseTypes.UNKNOWN_ERROR, _message = serviceResponseTypes.UNKNOWN_ERROR, _data = null) {
        return new ServiceResponse(serviceResponseTypes.TYPES.ERROR, _name, _message, _data);
    }
    static createSuccessResponse(_name = serviceResponseTypes.TYPES.SUCCESS, _message = serviceResponseTypes.TYPES.SUCCESS, _data = null) {
        return new ServiceResponse(serviceResponseTypes.TYPES.SUCCESS, _name, _message, _data);
    }
    static createWarningResponse(_name = serviceResponseTypes.TYPES.WARNING, _message = serviceResponseTypes.TYPES.WARNING, _data = null) {
        return new ServiceResponse(serviceResponseTypes.TYPES.WARNING, _name, _message, _data);
    }
    /**
     * Getter type
     * @return {string}
     */
    get type() {
        return this._type;
    }
    /**
     * Getter name
     * @return {string}
     */
    get name() {
        return this._name;
    }
    /**
     * Getter message
     * @return {string}
     */
    get message() {
        return this._message;
    }
    /**
     * Getter data
     * @return {any}
     */
    get data() {
        return this._data;
    }
    /**
     * Setter type
     * @param {string} value
     */
    set type(value) {
        this._type = value;
    }
    /**
     * Setter name
     * @param {string} value
     */
    set name(value) {
        this._name = value;
    }
    /**
     * Setter message
     * @param {string} value
     */
    set message(value) {
        this._message = value;
    }
    /**
     * Setter data
     * @param {any} value
     */
    set data(value) {
        this._data = value;
    }
}
module.exports = ServiceResponse;
