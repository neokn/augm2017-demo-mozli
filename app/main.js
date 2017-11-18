const fs = require('fs')
const {app, ipcMain} = require('electron')
const imagemin = require('imagemin')
const imageminGuetzli = require('imagemin-guetzli')
const imageminMozjpeg = require('imagemin-mozjpeg')
const MemoryInfo = require('./tools/memoryInfo.js')

let rendererSender

ipcMain.on('optimize-image', function (event, args) {
    for (let image of args.images) {
        console.log(`optimizing: ${image}`)
        
        imagemin([image], global.sharedObj.tmpPath, {use: [imageminGuetzli({quality: 84})]}).then(files => {
            for (let file of files) {
                imagemin([file.path], global.sharedObj.desktopPath, {use: [imageminMozjpeg({quality: 84})]}).then(mozli => {
                    console.log(`optimized: ${mozli[0].path}`)
                    fs.unlink(file.path, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        console.log(`Delete File: ${file.path}`)
                    })
                    var source = fs.statSync(image)
                    var target = fs.statSync(mozli[0].path)
                    var compressionRatio = Math.round(1000 * target['size']/source["size"])/10
                    event.sender.send('image-optimized', { compressionRatio: compressionRatio, path: mozli[0].path })
                })
            }
        })
    }  
})

setInterval(function() {
    let memoryInfo = new MemoryInfo()
    rendererSender.send('process-usage', {
        mem: memoryInfo
    })
}, 1000)

module.exports = function(sender) {
    rendererSender = sender
}
