const isValidNonEmptyArray = (arry: any) => {
    return arry && arry instanceof Array && arry.length > 0;
};

module.exports = {
    isValidNonEmptyArray
};
