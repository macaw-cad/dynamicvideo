"use strict";

const chalk = require('chalk');

class Logger {

    /**
     *
     */
    constructor() {
    }

    static log(message) {
        console.log(message);
    }

    static info(message) {
        console.info(chalk.blue(message));
    }

    static warn(message) {
        console.warn(chalk.bgYellow('WARNING:') + ' ' + chalk.yellow(message));
    }

    static error(message) {
        console.warn(chalk.bgRed('ERROR: ') + ' ' + chalk.red(message));
    }

}

module.exports = Logger;
