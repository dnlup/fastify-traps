'use strict'

const Fastify = require('fastify')
const plugin = require('../../')
const { send, fastifyOptions } = require('./util')

const fastify = Fastify(fastifyOptions)

fastify.register(plugin, {
  onSignal () { console.log('custom onSignal hook') },
  onClose () { console.log('custom onClose hook') },
  strict: false
})

fastify.listen(0, err => {
  send(err ? 'error' : 'listening')
})
