import Icons from "../constants/unicodes";
export class TextFormatter {
    constructor() {}

    public formatInfoText(message: string = ""): string {
        return `${Icons.NOTIFICATIONS.INFO} INFO: ${message}`;
    }

    public formatWarningText(message: string): string {
        return `${Icons.NOTIFICATIONS.WARNING} WARNING: ${message}`;
    }

    public formatErrorText(message: string): string {
        return `${Icons.NOTIFICATIONS.ERROR} ERROR: ${message}`;
    }

    public formatSuccessText(message: string): string {
        return `${Icons.NOTIFICATIONS.SUCCESS} SUCCESS: ${message}`;
    }
}
