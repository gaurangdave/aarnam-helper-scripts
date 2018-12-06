export declare class ColorFormatter {
    static ColorTypes: TypeMapping;
    private _colorMapping;
    private _format;
    formatInfo(message: string): any;
    formatWarning(message: string): any;
    formatSuccess(message: string): any;
    formatError(message: string): any;
}
export declare type TypeMapping = {
    [name: string]: string;
};
