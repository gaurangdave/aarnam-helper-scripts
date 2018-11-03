"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.ServiceResponse = ServiceResponse;
// module.exports = ServiceResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmljZVJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiU2VydmljZVJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMzRSxNQUFhLGVBQWU7SUFNeEIsWUFDSSxPQUFlLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQy9DLE9BQWUsb0JBQW9CLENBQUMsYUFBYSxFQUNqRCxVQUFrQixvQkFBb0IsQ0FBQyxhQUFhLEVBQ3BELE9BQVksSUFBSTtRQUVoQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztRQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsTUFBTSxDQUFDLG1CQUFtQixDQUN0QixRQUFnQixvQkFBb0IsQ0FBQyxhQUFhLEVBQ2xELFdBQW1CLG9CQUFvQixDQUFDLGFBQWEsRUFDckQsUUFBYSxJQUFJO1FBRWpCLE9BQU8sSUFBSSxlQUFlLENBQ3RCLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQ2hDLEtBQUssRUFDTCxRQUFRLEVBQ1IsS0FBSyxDQUNSLENBQUM7SUFDTixDQUFDO0lBRUQsTUFBTSxDQUFDLHFCQUFxQixDQUN4QixRQUFnQixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNsRCxXQUFtQixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNyRCxRQUFhLElBQUk7UUFFakIsT0FBTyxJQUFJLGVBQWUsQ0FDdEIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFDbEMsS0FBSyxFQUNMLFFBQVEsRUFDUixLQUFLLENBQ1IsQ0FBQztJQUNOLENBQUM7SUFFRCxNQUFNLENBQUMscUJBQXFCLENBQ3hCLFFBQWdCLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQ2xELFdBQW1CLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQ3JELFFBQWEsSUFBSTtRQUVqQixPQUFPLElBQUksZUFBZSxDQUN0QixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUNsQyxLQUFLLEVBQ0wsUUFBUSxFQUNSLEtBQUssQ0FDUixDQUFDO0lBQ04sQ0FBQztJQUNEOzs7T0FHRztJQUNILElBQVcsSUFBSTtRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxJQUFJO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFXLE9BQU87UUFDZCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQVcsSUFBSTtRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxJQUFJLENBQUMsS0FBYTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxJQUFJLENBQUMsS0FBYTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxPQUFPLENBQUMsS0FBYTtRQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBVyxJQUFJLENBQUMsS0FBVTtRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0NBQ0o7QUF2SEQsMENBdUhDO0FBRUQsb0NBQW9DIn0=