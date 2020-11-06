'use strict'

const Fastify = require('fastify')
const plugin = require('../../')
const { send, fastifyOptions } = require('./util')

const fastify = Fastify(fastifyOptions)

fastify.register((f, o, n) => {
  f.addHook('onClose', (f, n) => {
    n(new Error('test error'))
  })
  n()
})

fastify.register(plugin, {
  onError (error) { console.log('custom onError hook') }, // eslint-disable-line
  strict: false
})

fastify.listen(0, err => {
  send(err ? 'error' : 'listening')
})
