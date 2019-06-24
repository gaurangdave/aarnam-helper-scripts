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
exports.default = Logger;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvbG9nZ2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscURBQWtEO0FBQ2xELG1EQUFnRDtBQUVoRCxtREFBZ0Q7QUFFaEQsTUFBcUIsTUFBTTtJQU12QjtRQUNJLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLDZCQUFhLEVBQUUsQ0FBQztRQUkxQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFPTSxJQUFJLENBQUMsR0FBRyxNQUFXO1FBQ3RCLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FDL0QsR0FBRyxNQUFNLENBQ1osQ0FBQztRQUNGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQ3BELElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUM5QyxDQUFDO1FBQ0YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFPTSxJQUFJLENBQUMsR0FBRyxNQUFXO1FBQ3RCLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FDL0QsR0FBRyxNQUFNLENBQ1osQ0FBQztRQUNGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQ3ZELElBQUksQ0FBQyxjQUFjLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQ2pELENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDckQsQ0FBQztJQU9NLEtBQUssQ0FBQyxHQUFHLE1BQVc7UUFDdkIsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUMvRCxHQUFHLE1BQU0sQ0FDWixDQUFDO1FBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FDckQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQy9DLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDckQsQ0FBQztJQU9NLE9BQU8sQ0FBQyxHQUFHLE1BQVc7UUFDekIsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUMvRCxHQUFHLE1BQU0sQ0FDWixDQUFDO1FBQ0YsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FDdkQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FDakQsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBT08sZUFBZSxDQUNuQixPQUFtQyxFQUNuQyxHQUFHLE1BQVc7UUFFZCxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUM3QixPQUFPO2dCQUNILE9BQU87Z0JBQ1AsTUFBTTthQUNULENBQUM7U0FDTDtRQUVELElBQUksT0FBTyxZQUFZLEtBQUssRUFBRTtZQUMxQixPQUFPO2dCQUNILE9BQU8sRUFBRSxFQUFFO2dCQUNYLE1BQU0sRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDO2FBQ2xDLENBQUM7U0FDTDtRQUVELE9BQU87WUFDSCxPQUFPLEVBQUUsRUFBRTtZQUNYLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztTQUNwQyxDQUFDO0lBQ04sQ0FBQztJQUVPLE1BQU0sQ0FBQyxPQUFlLEVBQUUsTUFBVztRQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtZQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDN0M7SUFDTCxDQUFDOztBQXhHYSxzQkFBZSxHQUFZLEtBQUssQ0FBQztBQUpuRCx5QkE2R0M7QUFBQSxDQUFDIn0=