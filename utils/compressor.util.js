const imagemin = require('imagemin')
const  Jpeg = require('imagemin-jpegtran')
const  Png  = require('imagemin-pngquant')
const  svg = require('imagemin-svgo')
const gif = require('imagemin-giflossy')
const {} = require('path')
const zlib = require('zlib')
const zip = zlib.createGzip()
const unzip = zlib.createGunzip()
const {createReadStream, createWriteStream} = require('fs')

const compressor =async (url) => {
    try {
        await imagemin([`/*.{png,jpeg,gif,svg}`],{
            destination:``,
            plugins:[
                Jpeg(), 
                Png({quality:[0.6, 0.8]}),
                svg({plugins:[
                    {active:true}
                ]}),
                gif({interlaced:true})
            ]
        } )
    } catch (error) {
        
    }
}

const zipUp = (inp, out) => {
    createReadStream(inp).pipe(zip).pipe(createWriteStream(out))
}
const unZip = (inp, out) => {``
    createReadStream(inp).pipe(unzip).pipe(createWriteStream(out))
}