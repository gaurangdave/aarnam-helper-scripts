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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZVJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3NlcnZpY2VSZXNwb25zZS9TZXJ2aWNlUmVzcG9uc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLG9CQUFvQixHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ3RFLE1BQWEsZUFBZTtJQU14QixZQUNJLE9BQWUsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEtBQUssRUFDL0MsT0FBZSxvQkFBb0IsQ0FBQyxhQUFhLEVBQ2pELFVBQWtCLG9CQUFvQixDQUFDLGFBQWEsRUFDcEQsT0FBWSxJQUFJO1FBRWhCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxNQUFNLENBQUMsbUJBQW1CLENBQ3RCLFFBQWdCLG9CQUFvQixDQUFDLGFBQWEsRUFDbEQsV0FBbUIsb0JBQW9CLENBQUMsYUFBYSxFQUNyRCxRQUFhLElBQUk7UUFFakIsT0FBTyxJQUFJLGVBQWUsQ0FDdEIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEtBQUssRUFDaEMsS0FBSyxFQUNMLFFBQVEsRUFDUixLQUFLLENBQ1IsQ0FBQztJQUNOLENBQUM7SUFFRCxNQUFNLENBQUMscUJBQXFCLENBQ3hCLFFBQWdCLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQ2xELFdBQW1CLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQ3JELFFBQWEsSUFBSTtRQUVqQixPQUFPLElBQUksZUFBZSxDQUN0QixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNsQyxLQUFLLEVBQ0wsUUFBUSxFQUNSLEtBQUssQ0FDUixDQUFDO0lBQ04sQ0FBQztJQUVELE1BQU0sQ0FBQyxxQkFBcUIsQ0FDeEIsUUFBZ0Isb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDbEQsV0FBbUIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDckQsUUFBYSxJQUFJO1FBRWpCLE9BQU8sSUFBSSxlQUFlLENBQ3RCLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQ2xDLEtBQUssRUFDTCxRQUFRLEVBQ1IsS0FBSyxDQUNSLENBQUM7SUFDTixDQUFDO0lBS0QsSUFBVyxJQUFJO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFNRCxJQUFXLElBQUk7UUFDWCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQU1ELElBQVcsT0FBTztRQUNkLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBTUQsSUFBVyxJQUFJO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFNRCxJQUFXLElBQUksQ0FBQyxLQUFhO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFNRCxJQUFXLElBQUksQ0FBQyxLQUFhO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFNRCxJQUFXLE9BQU8sQ0FBQyxLQUFhO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQzFCLENBQUM7SUFNRCxJQUFXLElBQUksQ0FBQyxLQUFVO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7Q0FDSjtBQXZIRCwwQ0F1SEMifQ==