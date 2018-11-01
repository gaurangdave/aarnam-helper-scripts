const isValidString = (strParam) => {
     if (strParam && strParam.toString().trim()) {
          return true;
     }

     return false;
}


module.exports = {
     isValidString
}