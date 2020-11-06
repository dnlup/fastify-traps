'use strict'

const Fastify = require('fastify')
const plugin = require('../../')

function send (payload) {
  if (process.send) {
    process.send(payload)
  }
}

const fastify = Fastify({
  logger: {
    level: 'warn'
  }
})

fastify.register(plugin, { strict: false })

fastify.listen(0, (err) => {
  const payload = err ? 'error' : 'listening'
  send(payload)
})
