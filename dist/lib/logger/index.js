"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
exports.validateParams = (message, ...params) => {
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
exports.info = (...params) => {
    const { message, params: passThroughParams } = exports.validateParams(...params);
    const msgString = colors.cyan(`INFO: ${message}`);
    console.info(msgString, ...passThroughParams);
};
exports.warn = (...params) => {
    const { message, params: passThroughParams } = exports.validateParams(...params);
    const msgString = colors.yellow(`WARNING: ${message}`);
    console.info(msgString, ...passThroughParams);
};
exports.error = (...params) => {
    const { message, params: passThroughParams } = exports.validateParams(...params);
    const msgString = colors.red(`ERROR: ${message}`);
    console.info(msgString, ...passThroughParams);
};
exports.success = (...params) => {
    const { message, params: passThroughParams } = exports.validateParams(...params);
    const msgString = colors.green(`SUCCESS: ${message}`);
    console.info(msgString, ...passThroughParams);
};
module.exports = {
    info: exports.info,
    warn: exports.warn,
    error: exports.error,
    success: exports.success
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvbG9nZ2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRXBCLFFBQUEsY0FBYyxHQUFHLENBQzFCLE9BQW1DLEVBQ25DLEdBQUcsTUFBVyxFQUNoQixFQUFFO0lBQ0EsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDN0IsT0FBTztZQUNILE9BQU87WUFDUCxNQUFNO1NBQ1QsQ0FBQztLQUNMO0lBRUQsSUFBSSxPQUFPLFlBQVksS0FBSyxFQUFFO1FBQzFCLE9BQU87WUFDSCxPQUFPLEVBQUUsRUFBRTtZQUNYLE1BQU0sRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsTUFBTSxDQUFDO1NBQ2xDLENBQUM7S0FDTDtJQUVELE9BQU87UUFDSCxPQUFPLEVBQUUsRUFBRTtRQUNYLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztLQUNwQyxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRVcsUUFBQSxJQUFJLEdBQUcsQ0FBQyxHQUFHLE1BQVcsRUFBRSxFQUFFO0lBQ25DLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsc0JBQWMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ3pFLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUM7QUFFVyxRQUFBLElBQUksR0FBRyxDQUFDLEdBQUcsTUFBVyxFQUFFLEVBQUU7SUFDbkMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxzQkFBYyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDekUsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDdkQsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2xELENBQUMsQ0FBQztBQUVXLFFBQUEsS0FBSyxHQUFHLENBQUMsR0FBRyxNQUFXLEVBQUUsRUFBRTtJQUNwQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxHQUFHLHNCQUFjLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUN6RSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNsRCxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLGlCQUFpQixDQUFDLENBQUM7QUFDbEQsQ0FBQyxDQUFDO0FBRVcsUUFBQSxPQUFPLEdBQUcsQ0FBQyxHQUFHLE1BQVcsRUFBRSxFQUFFO0lBQ3RDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsc0JBQWMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQ3pFLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsWUFBWSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsSUFBSSxFQUFKLFlBQUk7SUFDSixJQUFJLEVBQUosWUFBSTtJQUNKLEtBQUssRUFBTCxhQUFLO0lBQ0wsT0FBTyxFQUFQLGVBQU87Q0FDVixDQUFDIn0=