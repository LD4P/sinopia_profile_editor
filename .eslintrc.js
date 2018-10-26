module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:security/recommended",
    "plugin:jest/recommended"
  ],
  overrides: [
    {
      files: "**/*.js",
      env: {
        jest: true
      },
      plugins: [ "jest", "security" ],
      rules: {
        "no-console": "warn",
        "no-extra-semi": "warn",
        "no-undef": "warn",
        "no-unreachable": "warn",
        "no-unused-vars": "warn",
        "no-useless-escape": "warn"
      },
      "globals": {
          "angular": true,
          "document": true,
          "page": true,
          "window": true
      }
    },
    {
      files: ["source/__tests__/**/*.js", "server.js"],
      rules: {
        "no-console": "off"
      }
    }
  ]
};
