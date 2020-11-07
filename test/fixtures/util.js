'use strict'

exports.send = function (payload) {
  if (process.send) {
    process.send(payload)
  }
}

exports.fastifyOptions = {
  logger: {
    level: 'warn'
  }
}
