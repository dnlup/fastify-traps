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

function onCloseSignal ({ timeout, onSignal, onClose, onTimeout, onError }, signal) {
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
    timeout: 3e4,
    onSignal: onSignal.bind(fastify),
    onClose: onClose.bind(fastify),
    onTimeout: onTimeout.bind(fastify),
    onError: onError.bind(fastify),
    strict: true
  }
  const config = Object.assign({}, DEFAULTS, opts)

  for (const func of ['onSignal', 'onClose', 'onTimeout', 'onError']) {
    const f = config[func]
    if (typeof f !== 'function') {
      return next(new TypeError(`${func} must be a function, received ${typeof f}`))
    }
  }
  if (typeof config.timeout !== 'number') {
    return next(new TypeError(`timeout must be a number, received ${typeof config.timeout}`))
  }
  if (config.timeout < 1) {
    return next(new RangeError(`timeout must be greater than 0, received ${config.timeout}`))
  }
  if (typeof config.strict !== 'boolean') {
    return next(new TypeError(`strict must be a boolean, received ${typeof config.strict}`))
  }

  for (const signal of ['SIGINT', 'SIGTERM']) {
    /* istanbul ignore next  */
    if (config.strict && process.listenerCount(signal) > 0) {
      return next(new Error(`A ${signal} handler is already registered`))
    }
    process.once(signal, onCloseSignal.bind(fastify, config))
  }
  next()
}

module.exports = fp(plugin, {
  fastify: '^4.0.0',
  name: '@dnlup/fastify-traps'
})
