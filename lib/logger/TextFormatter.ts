export class TextFormatter {
    constructor() {}

    public formatInfoText(message: string = ""): string {
        return `INFO: ${message}`;
    }

    public formatWarningText(message: string): string {
        return `WARNING: ${message}`;
    }

    public formatErrorText(message: string): string {
        return `ERROR: ${message}`;
    }

    public formatSuccessText(message: string): string {
        return `SUCCESS: ${message}`;
    }
}
