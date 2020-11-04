'use strict'

const { test } = require('tap')

test('invalid options', { todo: true }, t => {})
test('valid options', { todo: true }, t => {})
test('close', { todo: true }, t => {})
test('close timeout', { todo: true }, t => {})
test('close error', { todo: true }, t => {})
