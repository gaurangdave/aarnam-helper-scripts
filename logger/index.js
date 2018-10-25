const colors = require('colors');

const validateParams = (message, ...params) => {
     if (typeof message === 'string') {
          return {
               message,
               params,
          };
     }

     if (message instanceof Array) {
          return {
               message: '',
               params: [...message, ...params],
          };
     }

     return {
          message: '',
          params: [...[message], ...params],
     };
};

const info = (...params) => {
     const {
          message,
          params: passThroughParams
     } = validateParams(...params);
     const msgString = `INFO: ${message}`.cyan;
     console.info(msgString, ...passThroughParams);
};

const warn = (...params) => {
     const {
          message,
          params: passThroughParams
     } = validateParams(...params);
     const msgString = `WARNING: ${message}`.yellow;
     console.info(msgString, ...passThroughParams);
};

const error = (...params) => {
     const {
          message,
          params: passThroughParams
     } = validateParams(...params);
     const msgString = `ERROR: ${message}`.red;
     console.info(msgString, ...passThroughParams);
};

const success = (...params) => {
     const {
          message,
          params: passThroughParams
     } = validateParams(...params);
     const msgString = `SUCCESS: ${message}`.green;
     console.info(msgString, ...passThroughParams);
};

module.exports = {
     info,
     warn,
     error,
     success,
};