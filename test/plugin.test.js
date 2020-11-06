'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const plugin = require('../')

test('invalid options', async t => {
  const list = [
    {
      opts: {
        onSignal: null
      },
      error: new TypeError('onSignal must be a function, received object')
    },
    {
      opts: {
        onClose: null
      },
      error: new TypeError('onClose must be a function, received object')
    },
    {
      opts: {
        onTimeout: null
      },
      error: new TypeError('onTimeout must be a function, received object')
    },
    {
      opts: {
        onError: null
      },
      error: new TypeError('onError must be a function, received object')
    },
    {
      opts: {
        timeout: '7'
      },
      error: new TypeError('timeout must be a number, received string')
    },
    {
      opts: {
        timeout: 0
      },
      error: new RangeError('timeout must be greather than 0, received 0')
    },
    {
      opts: {
        strict: 'true'
      },
      error: new TypeError('strict must be a boolean, received string')
    }
  ]

  for (const [index, item] of list.entries()) {
    const fastify = Fastify()
    const opts = Object.assign({}, item.opts, item.opts.strict ? {} : { strict: false })
    await t.rejects(() => fastify.register(plugin, opts), item.error, `item ${index}`)
  }
  t.end()
})

test('valid options', async t => {
  const list = [
    {
      opts: {
        onSignal: () => {}
      }
    },
    {
      opts: {
        onClose: () => {}
      }
    },
    {
      opts: {
        onTimeout: () => {}
      }
    },
    {
      opts: {
        onError: () => {}
      }
    },
    {
      opts: {
        timeout: 7
      }
    }
  ]

  for (const [index, item] of list.entries()) {
    const fastify = Fastify()
    const opts = Object.assign({}, item.opts, { strict: false })
    await t.resolves(() => fastify.register(plugin, opts), `item ${index}`)
  }
  t.end()
})
test('close', { todo: true }, t => {})
test('close timeout', { todo: true }, t => {})
test('close error', { todo: true }, t => {})