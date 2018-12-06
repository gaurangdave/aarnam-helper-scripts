export declare class Logger {
    private _colorFormatter;
    private _textFormatter;
    private _loggerObject;
    static LoggingDisabled: boolean;
    constructor();
    info(...params: any): void;
    warn(...params: any): void;
    error(...params: any): void;
    success(...params: any): void;
    private _validateParams;
    private _logIt;
}
