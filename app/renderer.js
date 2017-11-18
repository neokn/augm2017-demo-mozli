const ipc = require('electron').ipcRenderer
let counter = 0
ipc.on('image-optimized', (event, arg) => {
    $('#drop-zone').find('.progress').hide()
    swal(`${arg.compressionRatio}%`, arg.path);
})

ipc.on('process-usage', (event, args) => {
    let percentage = Math.round(1000 * args.mem.usage/args.mem.total)/10
    $('#memory-usage').attr("aria-valuenow", percentage)
    $('#memory-usage').width(`${percentage}%`)
    $('#memory-usage').text(`Memory Monitor: ${Math.round(10 * args.mem.usage/1073741824)/10} GB`)
})

const optimizeImage = function(args) {
    ipc.send('optimize-image', args)
    $('#drop-zone').find('.progress').show()
}