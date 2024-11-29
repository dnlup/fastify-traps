'use strict'

const Fastify = require('fastify')
const plugin = require('../../')
const { send, fastifyOptions } = require('./util')

const fastify = Fastify(fastifyOptions)

fastify.register(plugin, { strict: false })

fastify.listen({ port: 0 }).then(() => send('listening')).catch(e => send('error'))
