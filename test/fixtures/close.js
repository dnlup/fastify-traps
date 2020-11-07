'use strict'

const Fastify = require('fastify')
const plugin = require('../../')
const { send, fastifyOptions } = require('./util')

const fastify = Fastify(fastifyOptions)

fastify.register(plugin, { strict: false })

fastify.listen(0, (err) => {
  const payload = err ? 'error' : 'listening'
  send(payload)
})
