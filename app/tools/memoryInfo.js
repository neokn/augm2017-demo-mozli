'use strict'
const os = require('os')
const totalMem = os.totalmem()

module.exports = function() {
    this.memoryUsage = totalMem - os.freemem()
    return {
        total: totalMem,
        usage: this.memoryUsage
    }
}