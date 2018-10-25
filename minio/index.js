const message = null;

const initialize = () => {
     message = "hello world";
};

const sayHello = () => {
     console.log(message);
}

module.exports = {
     initialize
};