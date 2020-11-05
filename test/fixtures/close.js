'use strict'

const Fastify = require('fastify')
const plugin = require('../../')

const fastify = Fastify({
  logger: {
    level: 'warn'
  }
})

fastify.register(plugin)
fastify.listen(0)
