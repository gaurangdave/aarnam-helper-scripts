declare const colors: any;
declare const validateParams: (message?: any, ...params: any) => {
    message: string;
    params: any;
};
declare const info: (...params: any) => void;
declare const warn: (...params: any) => void;
declare const error: (...params: any) => void;
declare const success: (...params: any) => void;
