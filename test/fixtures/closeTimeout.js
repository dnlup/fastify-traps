'use strict'

const Fastify = require('fastify')
const plugin = require('../../')
const { send, fastifyOptions } = require('./util')

const fastify = Fastify(fastifyOptions)

fastify.register((f, o, n) => {
  f.addHook('onClose', (f, n) => {
    setTimeout(n, 2000)
  })
  n()
})

fastify.register(plugin, {
  timeout: 500,
  strict: false
})

fastify.listen({ port: 0 }).then(() => send('listening')).catch(e => send('error'))
