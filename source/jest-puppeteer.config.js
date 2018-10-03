module.exports = {
  launch: {
    headless: process.env.CI === 'true'
  },
  server: {
    command: 'node server.js',
    port: 8000
  }
}
