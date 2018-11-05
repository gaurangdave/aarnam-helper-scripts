"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceResponseTypes = require("../constants/service_response");
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
    get type() {
        return this._type;
    }
    get name() {
        return this._name;
    }
    get message() {
        return this._message;
    }
    get data() {
        return this._data;
    }
    set type(value) {
        this._type = value;
    }
    set name(value) {
        this._name = value;
    }
    set message(value) {
        this._message = value;
    }
    set data(value) {
        this._data = value;
    }
}
exports.ServiceResponse = ServiceResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZVJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc2VydmljZVJlc3BvbnNlL1NlcnZpY2VSZXNwb25zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7QUFDdEUsTUFBYSxlQUFlO0lBTXhCLFlBQ0ksT0FBZSxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUMvQyxPQUFlLG9CQUFvQixDQUFDLGFBQWEsRUFDakQsVUFBa0Isb0JBQW9CLENBQUMsYUFBYSxFQUNwRCxPQUFZLElBQUk7UUFFaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxtQkFBbUIsQ0FDdEIsUUFBZ0Isb0JBQW9CLENBQUMsYUFBYSxFQUNsRCxXQUFtQixvQkFBb0IsQ0FBQyxhQUFhLEVBQ3JELFFBQWEsSUFBSTtRQUVqQixPQUFPLElBQUksZUFBZSxDQUN0QixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUNoQyxLQUFLLEVBQ0wsUUFBUSxFQUNSLEtBQUssQ0FDUixDQUFDO0lBQ04sQ0FBQztJQUVELE1BQU0sQ0FBQyxxQkFBcUIsQ0FDeEIsUUFBZ0Isb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDbEQsV0FBbUIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDckQsUUFBYSxJQUFJO1FBRWpCLE9BQU8sSUFBSSxlQUFlLENBQ3RCLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQ2xDLEtBQUssRUFDTCxRQUFRLEVBQ1IsS0FBSyxDQUNSLENBQUM7SUFDTixDQUFDO0lBRUQsTUFBTSxDQUFDLHFCQUFxQixDQUN4QixRQUFnQixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNsRCxXQUFtQixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNyRCxRQUFhLElBQUk7UUFFakIsT0FBTyxJQUFJLGVBQWUsQ0FDdEIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDbEMsS0FBSyxFQUNMLFFBQVEsRUFDUixLQUFLLENBQ1IsQ0FBQztJQUNOLENBQUM7SUFLRCxJQUFXLElBQUk7UUFDWCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQU1ELElBQVcsSUFBSTtRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBTUQsSUFBVyxPQUFPO1FBQ2QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFNRCxJQUFXLElBQUk7UUFDWCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQU1ELElBQVcsSUFBSSxDQUFDLEtBQWE7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQU1ELElBQVcsSUFBSSxDQUFDLEtBQWE7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztJQU1ELElBQVcsT0FBTyxDQUFDLEtBQWE7UUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQztJQU1ELElBQVcsSUFBSSxDQUFDLEtBQVU7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDdkIsQ0FBQztDQUNKO0FBdkhELDBDQXVIQyJ9