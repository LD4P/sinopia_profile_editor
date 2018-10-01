module.exports = {
    extends: [ "eslint:recommended", "plugin:node/recommended", "plugin:security/recommended"],
    overrides: [
      {
        files: "**/*.js",
        env: {
          jest: true
        },
        plugins: [
          "jest", "security"
        ],
        rules: {
            "no-console": "warn",
            "no-extra-semi": "warn",
            "no-undef": "warn",
            "no-unreachable": "warn",
            "no-unused-vars": "warn",
            "no-useless-escape": "warn"
        }
      }
  ]
};
