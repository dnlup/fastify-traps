'use strict'

const { test } = require('tap')
const { fork } = require('child_process')
const { join } = require('path')
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
test('close', t => {
  t.plan(10)
  function testSignal (signal) {
    const server = fork(join(__dirname, 'fixtures/close.js'), {
      stdio: 'pipe'
    })

    let stdout = ''
    let errored = false

    server.on('message', payload => {
      switch (payload) {
        case 'error':
          errored = true
          break
        case 'listening':
          server.kill(signal)
          break
      }
    })

    server.stdout.on('data', chunk => {
      stdout += chunk
    })

    server.on('exit', code => {
      t.notOk(errored)
      t.equal(code, 0)
      const reg = new RegExp(`Received Signal: ${signal}`)
      t.ok(reg.test(stdout))
      t.ok(/Closing/.test(stdout))
      t.ok(/Closed/.test(stdout))
    })
    server.on('error', t.error)
  }

  for (const signal of ['SIGINT', 'SIGTERM']) {
    testSignal(signal)
  }
})

test('close timeout', t => {
  const server = fork(join(__dirname, 'fixtures/closeTimeout.js'), {
    stdio: 'pipe'
  })

  let stdout = ''
  let errored = false

  server.on('message', payload => {
    switch (payload) {
      case 'error':
        errored = true
        break
      case 'listening':
        server.kill('SIGINT')
        break
    }
  })

  server.stdout.on('data', chunk => {
    stdout += chunk
  })

  server.on('exit', code => {
    t.notOk(errored)
    t.equal(code, 1)
    t.ok(/Received Signal: SIGINT/.test(stdout))
    t.ok(/Closing/.test(stdout))
    t.ok(/forcing exit/.test(stdout))
    t.end()
  })
})

test('close error', t => {
  const server = fork(join(__dirname, 'fixtures/closeError.js'), {
    stdio: 'pipe'
  })

  let stdout = ''
  let errored = false

  server.on('message', payload => {
    switch (payload) {
      case 'error':
        errored = true
        break
      case 'listening':
        server.kill('SIGINT')
        break
    }
  })

  server.stdout.on('data', chunk => {
    stdout += chunk
  })

  server.on('exit', code => {
    t.notOk(errored)
    t.equal(code, 1)
    t.ok(/Received Signal: SIGINT/.test(stdout))
    t.ok(/Closing/.test(stdout))
    t.ok(/"type":"Error","msg":"test error"\}/.test(stdout))
    t.end()
  })
})

test('custom close hooks', t => {
  const server = fork(join(__dirname, 'fixtures/customCloseHooks.js'), {
    stdio: 'pipe'
  })

  let stdout = ''
  let errored = false

  server.on('message', payload => {
    switch (payload) {
      case 'error':
        errored = true
        break
      case 'listening':
        server.kill('SIGINT')
        break
    }
  })

  server.stdout.on('data', chunk => {
    stdout += chunk
  })

  server.on('exit', code => {
    t.notOk(errored)
    t.equal(code, 0)
    t.ok(/custom onSignal hook/.test(stdout))
    t.ok(/custom onClose hook/.test(stdout))
    t.end()
  })
})

test('custom timeout hook', t => {
  const server = fork(join(__dirname, 'fixtures/customTimeoutHook.js'), {
    stdio: 'pipe'
  })

  let stdout = ''
  let errored = false

  server.on('message', payload => {
    switch (payload) {
      case 'error':
        errored = true
        break
      case 'listening':
        server.kill('SIGINT')
        break
    }
  })

  server.stdout.on('data', chunk => {
    stdout += chunk
  })

  server.on('exit', code => {
    t.notOk(errored)
    t.equal(code, 1)
    t.ok(/Received Signal: SIGINT/.test(stdout))
    t.ok(/Closing/.test(stdout))
    t.ok(/custom onTimeout hook/.test(stdout))
    t.end()
  })
})

test('custom timeout hook', t => {
  const server = fork(join(__dirname, 'fixtures/customErrorHook.js'), {
    stdio: 'pipe'
  })

  let stdout = ''
  let errored = false

  server.on('message', payload => {
    switch (payload) {
      case 'error':
        errored = true
        break
      case 'listening':
        server.kill('SIGINT')
        break
    }
  })

  server.stdout.on('data', chunk => {
    stdout += chunk
  })

  server.on('exit', code => {
    t.notOk(errored)
    t.equal(code, 1)
    t.ok(/Received Signal: SIGINT/.test(stdout))
    t.ok(/Closing/.test(stdout))
    t.ok(/custom onError hook/.test(stdout))
    t.end()
  })
})
