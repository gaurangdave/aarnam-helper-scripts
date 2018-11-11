const colors = require("colors");

export const validateParams = (
    message?: string | Array<any> | any,
    ...params: any
) => {
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
};

export const info = (...params: any) => {
    const { message, params: passThroughParams } = validateParams(...params);
    const msgString = colors.cyan(`INFO: ${message}`);
    console.info(msgString, ...passThroughParams);
};

export const warn = (...params: any) => {
    const { message, params: passThroughParams } = validateParams(...params);
    const msgString = colors.yellow(`WARNING: ${message}`);
    console.info(msgString, ...passThroughParams);
};

export const error = (...params: any) => {
    const { message, params: passThroughParams } = validateParams(...params);
    const msgString = colors.red(`ERROR: ${message}`);
    console.info(msgString, ...passThroughParams);
};

export const success = (...params: any) => {
    const { message, params: passThroughParams } = validateParams(...params);
    const msgString = colors.green(`SUCCESS: ${message}`);
    console.info(msgString, ...passThroughParams);
};

module.exports = {
    info,
    warn,
    error,
    success
};
