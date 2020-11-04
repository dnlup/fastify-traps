'use strict'

const fp = require('fastify-plugin')

function onSignal (signal) {
  this.log.warn(`Received Signal: ${signal}`)
  this.log.warn('Closing')
}

function onClose () {
  this.log.warn('Closed')
}

function onTimeout (timeout) {
  this.log.error(`Could not close before ${timeout} ms, forcing exit`)
}

function onError (error) {
  this.log.error(error)
}

function onCloseSignal ({ onSignal, onClose, onTimeout, onError, timeout }, signal) {
  onSignal(signal)

  const timer = setTimeout(() => {
    onTimeout(timeout)
    process.exit(1)
  }, timeout)

  // Try to close the fastify instance gracefully
  this.close()
    .then(() => {
      clearTimeout(timer)
      onClose()
      process.exit()
    })
    .catch((error) => {
      clearTimeout(timer)
      onError(error)
      process.exit(1)
    })
}

function plugin (fastify, opts, next) {
  const DEFAULTS = {
    onSignal: onSignal.bind(fastify),
    onClose: onClose.bind(fastify),
    onTimeout: onTimeout.bind(fastify),
    onError: onError.bind(fastify),
    timeout: 2000
  }
  const config = Object.assign({}, DEFAULTS, opts)

  for (const func of ['onSignal', 'onClose', 'onTimeout', 'onError']) {
    const f = config[func]
    if (typeof f !== 'function') {
      return next(new TypeError(`${func} must be a function, received ${f}`))
    }
  }
  if (typeof config.timeout !== 'number') {
    return next(new TypeError(`timeout must be a number, received ${config.timeout}`))
  }
  if (config.timeout < 1) {
    return next(new RangeError(`timeout must be grather than 0, received ${config.timeout}`))
  }

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, onCloseSignal.bind(fastify, config))
  }
  next()
}

module.exports = fp(plugin)
