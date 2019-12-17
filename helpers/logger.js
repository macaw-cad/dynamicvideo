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
        console.info(chalk.bgBlue.whiteBright('INFO:') + ' ' + chalk.blue(message));
    }

    static warn(message) {
        console.warn(chalk.bgYellow.whiteBright('WARNING:') + ' ' + chalk.yellow(message));
    }

    static error(message) {
        console.error(chalk.bgRed.whiteBright('ERROR:') + ' ' + chalk.red(message));
    }

    static table(message) {
        console.table(message);
    }

    static trace(message) {
        console.trace(message);
    }

}

module.exports = Logger;
