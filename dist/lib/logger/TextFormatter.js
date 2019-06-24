"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unicodes_1 = __importDefault(require("../constants/unicodes"));
class TextFormatter {
    constructor() { }
    formatInfoText(message = "") {
        return `${unicodes_1.default.NOTIFICATIONS.INFO} INFO: ${message}`;
    }
    formatWarningText(message) {
        return `${unicodes_1.default.NOTIFICATIONS.WARNING} WARNING: ${message}`;
    }
    formatErrorText(message) {
        return `${unicodes_1.default.NOTIFICATIONS.ERROR} ERROR: ${message}`;
    }
    formatSuccessText(message) {
        return `${unicodes_1.default.NOTIFICATIONS.SUCCESS} SUCCESS: ${message}`;
    }
}
exports.TextFormatter = TextFormatter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGV4dEZvcm1hdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9sb2dnZXIvVGV4dEZvcm1hdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFFQUEwQztBQUMxQyxNQUFhLGFBQWE7SUFDdEIsZ0JBQWUsQ0FBQztJQUVULGNBQWMsQ0FBQyxVQUFrQixFQUFFO1FBQ3RDLE9BQU8sR0FBRyxrQkFBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLFVBQVUsT0FBTyxFQUFFLENBQUM7SUFDMUQsQ0FBQztJQUVNLGlCQUFpQixDQUFDLE9BQWU7UUFDcEMsT0FBTyxHQUFHLGtCQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sYUFBYSxPQUFPLEVBQUUsQ0FBQztJQUNoRSxDQUFDO0lBRU0sZUFBZSxDQUFDLE9BQWU7UUFDbEMsT0FBTyxHQUFHLGtCQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssV0FBVyxPQUFPLEVBQUUsQ0FBQztJQUM1RCxDQUFDO0lBRU0saUJBQWlCLENBQUMsT0FBZTtRQUNwQyxPQUFPLEdBQUcsa0JBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxhQUFhLE9BQU8sRUFBRSxDQUFDO0lBQ2hFLENBQUM7Q0FDSjtBQWxCRCxzQ0FrQkMifQ==