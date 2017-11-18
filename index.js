const path = require('path')
const electronAppPath = path.join(__dirname, 'app')

require('module').globalPaths.push(path.join(electronAppPath, 'node_modules'))

require(electronAppPath)
