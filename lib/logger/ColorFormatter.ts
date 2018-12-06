const colors = require("colors");

export class ColorFormatter{

     public static ColorTypes:TypeMapping = {
          INFO:"INFO",
          WARNING:"WARNING",
          ERROR:"ERROR",
          SUCCESS:"SUCCESS",
          DEFAULT:"DEFAULT"    
     };

     private _colorMapping:ColorMapping = {
          "INFO": colors.cyan,
          "WARNING": colors.yellow,
          "ERROR": colors.red,
          "SUCCESS": colors.green,
          "DEFAULT": colors.green
     }

     /**
      * @private
      * @param {string} message
      * @param {string} [type=ColorFormatter.ColorTypes.DEFAULT]
      * @returns
      * @memberof ColorFormatter
      */
     private _format(message: string, type:string = ColorFormatter.ColorTypes.DEFAULT){
          const formattingFunc:Function = this._colorMapping[type] || colors.green;
          return formattingFunc(message);
     }

     /**
      * Helper function to format colors for info messages
      * @param {string} message
      * @returns
      * @memberof ColorFormatter
      */
     public formatInfo(message: string){
          return this._format(message, ColorFormatter.ColorTypes.INFO);
     }

     /**
      * Helper function to format colors for warning messages
      * @param {string} message
      * @returns
      * @memberof ColorFormatter
      */
     public formatWarning(message: string){
          return this._format(message, ColorFormatter.ColorTypes.WARNING);
     }

     /**
      * Helper function to format colors for success messages
      * @param {string} message
      * @returns
      * @memberof ColorFormatter
      */
     public formatSuccess(message: string){
          return this._format(message, ColorFormatter.ColorTypes.SUCCESS);
     }

     /**
      * Helper function to format colors for error messages
      * @param {string} message
      * @returns
      * @memberof ColorFormatter
      */
     public formatError(message: string){
          return this._format(message, ColorFormatter.ColorTypes.ERROR);
     }
}

export type TypeMapping = {
     [name: string]: string;
}

type ColorMapping = {
     [name: string]: Function;
}