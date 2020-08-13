'use strict';

function onCloseSignal(timeout, signal) {
    this.log.warn(`Received Signal: ${signal}`);
    this.log.warn('Closing');

    let timer;
    if (timeout) {
        timer = setTimeout(() => {
            this.log.error(
                `Could not close before ${timeout} ms, forcing exit`
            );
            process.exit(1);
        }, timeout);
    }

    // Try to close the fastify instance gracefully
    this.close()
        .then(() => {
            clearTimeout(timer);
            process.exit();
        })
        .catch((error) => {
            clearTimeout(timer);
            this.log.error(error);
            process.exit(1);
        });
}

module.exports = function (fastify, opts, next) {
    opts.timeout = opts.timeout | 0;
    for (const signal of ['SIGINT', 'SIGTERM']) {
        process.on(signal, onCloseSignal.bind(fastify, opts.timeout));
    }
    next();
};
