# fastify-traps

[![npm version](https://badge.fury.io/js/%40dnlup%2Fhrtime-utils.svg)](https://badge.fury.io/js/%40dnlup%2Ffastify-traps)
![Tests](https://github.com/dnlup/fastify-traps/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/dnlup/fastify-traps/branch/next/graph/badge.svg?token=93VKYKIKCJ)](https://codecov.io/gh/dnlup/fastify-traps)
[![Known Vulnerabilities](https://snyk.io/test/github/dnlup/fastify-traps/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dnlup/fastify-traps?targetFile=package.json)

> A fastify plugin to close the server gracefully on SIGINT and SIGTERM signals.

<!-- toc -->

- [Install](#install)
- [Usage](#usage)
    + [Default](#default)
    + [Custom close timeout](#custom-close-timeout)
    + [Custom hooks](#custom-hooks)
  * [Plugin options](#plugin-options)
    + [onSignal(signal)](#onsignalsignal)
    + [onClose()](#onclose)
    + [onTimeout(timeout)](#ontimeouttimeout)
    + [onError(error)](#onerrorerror)

<!-- tocstop -->

## Install

```bash
$ npm i @dnlup/fastify-traps
```

## Usage

#### Default

```js
const fastify = require('fastify')()
const traps = require('@dnlup/fastify-traps')

fastify.register(traps)

fastify.get('/', (request, reply) => {
  reply.send({ ok: true })
})

fastify.listen(3000)
```

The plugin will use the instance logger to print out some pieces of information like the signal received
and if it could close the fastify instance successfully.

#### Custom close timeout

By default, the plugin will wait 30 seconds for the server to close. After that, it will exit the process with code `1`.

You can change the value of the timeout.

```js
const fastify = require('fastify')()
const traps = require('@dnlup/fastify-traps')

fastify.register(traps, {
  timeout: 1000 // wait 1 second before forcing exiting
})

fastify.listen(3000)
```

#### Custom hooks

The plugin allows registering custom, synchronous functions to override the default hooks.

The context of a hook is bound to the `fastify` instance, so you can use `this` to refer to it.

```js
const fastify = require('fastify')()
const traps = require('@dnlup/fastify-traps')

fastify.register(traps, {
  onSignal(signal) {
    this.log.debug(`Received signal ${signal}`)
  },
  onClose() {
    this.log.info('Server closed')
  },
  onTimeout(timeout) {
    this.log.error(`Forcing close after ${timeout} ms`)
  },
  onError(error) {
    this.log.error(`Uh oh: ${error.message}`)
  }
})

fastify.listen(3000)
```

### Plugin options

* `timeout` `<number>`: number of milliseconds to wait for the server to close
* `onSignal` `<function>`: on signal custom [hook](#onsignal)
* `onClose` `<function>`: on signal custom [hook](#onclose)
* `onTimeout` `<function>`: on signal custom [hook](#ontimeout)
* `onError` `<function>`: on signal custom [hook](#onerror)
* `strict` `<boolean>`: error if a `SIGINT` or `SIGTERM` handler is already registered. **Default:** `true`.

As said previously, the hooks' context is bound to the `fastify` instance, so you can use `this` to refer to it.

The `strict` option is present for testing purposes. It is better to avoid registering the plugin instead of disabling the strict check.

#### onSignal(signal)

* `signal` `<string>`: the signal received

The plugin will call this hook when it received a `SIGINT` or `SIGTERM` signal.

#### onClose()

The plugin will call this hook when the server is closed.


#### onTimeout(timeout)

* `timeout` `<number>`: the number of milliseconds of the timeout

The plugin will call this hook when the timeout for waiting for the server to close has expired.

#### onError(error)

* `error` `<Error|*>`: the error that occurred while closing the server

The plugin will call this hook when there is an error when closing the server.
