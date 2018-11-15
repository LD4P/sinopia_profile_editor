// Copyright 2018 Stanford University see Apache2.txt for license
module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false'
  },
  server: {
    command: 'node server.js',
    port: 8000
  }
}
