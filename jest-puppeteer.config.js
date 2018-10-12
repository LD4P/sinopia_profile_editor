module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false'
  },
  server: {
    command: 'node server.js',
    port: 8000
  }
}
