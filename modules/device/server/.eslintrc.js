module.exports = {
  rules: {
    'new-cap': [2, { properties: true, newIsCapExceptions: ['acl.memoryBackend', 'acl']}],
    'space-infix-ops': 0,
    'no-loop-func': 0
  },
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  }
};
