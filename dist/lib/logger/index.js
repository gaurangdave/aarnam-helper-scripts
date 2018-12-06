"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ColorFormatter_1 = require("./ColorFormatter");
const TextFormatter_1 = require("./TextFormatter");
const ConsoleLogger_1 = require("./ConsoleLogger");
class Logger {
    constructor() {
        this._colorFormatter = new ColorFormatter_1.ColorFormatter();
        this._textFormatter = new TextFormatter_1.TextFormatter();
        this._loggerObject = new ConsoleLogger_1.ConsoleLogger();
    }
    info(...params) {
        const { message, params: passThroughParams } = this._validateParams(...params);
        const formattedMessage = this._colorFormatter.formatInfo(this._textFormatter.formatInfoText(message));
        this._logIt(formattedMessage, passThroughParams);
    }
    warn(...params) {
        const { message, params: passThroughParams } = this._validateParams(...params);
        const formattedMessage = this._colorFormatter.formatWarning(this._textFormatter.formatWarningText(message));
        this._logIt(formattedMessage, passThroughParams);
    }
    error(...params) {
        const { message, params: passThroughParams } = this._validateParams(...params);
        const formattedMessage = this._colorFormatter.formatError(this._textFormatter.formatErrorText(message));
        this._logIt(formattedMessage, passThroughParams);
    }
    success(...params) {
        const { message, params: passThroughParams } = this._validateParams(...params);
        const formattedMessage = this._colorFormatter.formatSuccess(this._textFormatter.formatSuccessText(message));
        this._logIt(formattedMessage, passThroughParams);
    }
    _validateParams(message, ...params) {
        if (typeof message === "string") {
            return {
                message,
                params
            };
        }
        if (message instanceof Array) {
            return {
                message: "",
                params: [...message, ...params]
            };
        }
        return {
            message: "",
            params: [...[message], ...params]
        };
    }
    _logIt(message, params) {
        if (!Logger.LoggingDisabled) {
            this._loggerObject.logIt(message, params);
        }
    }
}
Logger.LoggingDisabled = false;
exports.Logger = Logger;
module.exports = { Logger };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvbG9nZ2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscURBQWtEO0FBQ2xELG1EQUFnRDtBQUVoRCxtREFBZ0Q7QUFFaEQsTUFBYSxNQUFNO0lBTWY7UUFDSSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7UUFJMUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLDZCQUFhLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0lBT00sSUFBSSxDQUFDLEdBQUcsTUFBVztRQUN0QixNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQy9ELEdBQUcsTUFBTSxDQUNaLENBQUM7UUFDRixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUNwRCxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FDOUMsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBT00sSUFBSSxDQUFDLEdBQUcsTUFBVztRQUN0QixNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQy9ELEdBQUcsTUFBTSxDQUNaLENBQUM7UUFDRixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUN2RCxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUNqRCxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFPTSxLQUFLLENBQUMsR0FBRyxNQUFXO1FBQ3ZCLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FDL0QsR0FBRyxNQUFNLENBQ1osQ0FBQztRQUNGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQ3JELElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUMvQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFPTSxPQUFPLENBQUMsR0FBRyxNQUFXO1FBQ3pCLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FDL0QsR0FBRyxNQUFNLENBQ1osQ0FBQztRQUNGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQ3ZELElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQ2pELENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDckQsQ0FBQztJQU9PLGVBQWUsQ0FDbkIsT0FBbUMsRUFDbkMsR0FBRyxNQUFXO1FBRWQsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDN0IsT0FBTztnQkFDSCxPQUFPO2dCQUNQLE1BQU07YUFDVCxDQUFDO1NBQ0w7UUFFRCxJQUFJLE9BQU8sWUFBWSxLQUFLLEVBQUU7WUFDMUIsT0FBTztnQkFDSCxPQUFPLEVBQUUsRUFBRTtnQkFDWCxNQUFNLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQzthQUNsQyxDQUFDO1NBQ0w7UUFFRCxPQUFPO1lBQ0gsT0FBTyxFQUFFLEVBQUU7WUFDWCxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7U0FDcEMsQ0FBQztJQUNOLENBQUM7SUFFTyxNQUFNLENBQUMsT0FBZSxFQUFFLE1BQVc7UUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUU7WUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzdDO0lBQ0wsQ0FBQzs7QUF4R2Esc0JBQWUsR0FBWSxLQUFLLENBQUM7QUFKbkQsd0JBNkdDO0FBR0QsTUFBTSxDQUFDLE9BQU8sR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDIn0=