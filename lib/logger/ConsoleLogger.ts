import { LoggerInterface } from "./LoggerInterface";

export class ConsoleLogger implements LoggerInterface{
     public logIt(message: string, params: any): void {
          console.log(message, ...params);
     }
}