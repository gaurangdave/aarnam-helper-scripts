import { Observable } from "rxjs";
export declare const directoryWalker: (dirName: string) => Observable<WalkerFsObject>;
export declare const fileWalker: (dirName: string) => Observable<WalkerFsObject>;
export declare const contentWalker: (dirName: string) => Observable<WalkerFsObject>;
export declare type WalkerFsObject = {
    filePath: string;
    stats: any;
};
