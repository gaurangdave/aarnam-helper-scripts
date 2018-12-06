// const colors = require("colors");
import { ColorFormatter } from "./ColorFormatter";
import { TextFormatter } from "./TextFormatter";
import { LoggerInterface } from "./LoggerInterface";
import { ConsoleLogger } from "./ConsoleLogger";

export class Logger {
    private _colorFormatter: ColorFormatter;
    private _textFormatter: TextFormatter;
    private _loggerObject: LoggerInterface;
    public static LoggingDisabled: boolean = false;

    constructor() {
        this._colorFormatter = new ColorFormatter();
        this._textFormatter = new TextFormatter();

        // TODO make this dynamic based on logging preference
        // File vs Console.
        this._loggerObject = new ConsoleLogger();
    }

    /**
     * Function to log info messages.
     * @param {...any} params
     * @memberof Logger
     */
    public info(...params: any) {
        const { message, params: passThroughParams } = this._validateParams(
            ...params
        );
        const formattedMessage = this._colorFormatter.formatInfo(
            this._textFormatter.formatInfoText(message)
        );
        this._logIt(formattedMessage, passThroughParams);
    }

    /**
     * Function to log warning messages
     * @param {...any} params
     * @memberof Logger
     */
    public warn(...params: any) {
        const { message, params: passThroughParams } = this._validateParams(
            ...params
        );
        const formattedMessage = this._colorFormatter.formatWarning(
            this._textFormatter.formatWarningText(message)
        );
        this._logIt(formattedMessage, passThroughParams);
    }

    /**
     * Function to log error messages.
     * @param {...any} params
     * @memberof Logger
     */
    public error(...params: any) {
        const { message, params: passThroughParams } = this._validateParams(
            ...params
        );
        const formattedMessage = this._colorFormatter.formatError(
            this._textFormatter.formatErrorText(message)
        );
        this._logIt(formattedMessage, passThroughParams);
    }

    /**
     * Function to log success messages
     * @param {...any} params
     * @memberof Logger
     */
    public success(...params: any) {
        const { message, params: passThroughParams } = this._validateParams(
            ...params
        );
        const formattedMessage = this._colorFormatter.formatSuccess(
            this._textFormatter.formatSuccessText(message)
        );
        this._logIt(formattedMessage, passThroughParams);
    }

    /**
     * Helper function to validate input params.
     * @param message
     * @param params
     */
    private _validateParams(
        message?: string | Array<any> | any,
        ...params: any
    ) {
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

    private _logIt(message: string, params: any) {
        if (!Logger.LoggingDisabled) {
            this._loggerObject.logIt(message, params);
        }
    }
}


module.exports = { Logger };