const tasks = list => list.join(' && ')

module.exports = {
  hooks: {
    'pre-commit': tasks(['lint-staged', 'npm test'])
  }
}
