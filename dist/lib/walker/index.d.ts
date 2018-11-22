import { Observable } from "rxjs";
export declare const directoryWalker: (dirName: string) => Observable<string>;
export declare const fileWalker: (dirName: string) => Observable<string>;
export declare const contentWalker: (dirName: string) => Observable<string>;
