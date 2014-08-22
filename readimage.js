"use strict";

var jpeg = require("jpeg-js")
var png = require("pngparse")
var gif = require("omggif")
var bufferEqual = require("buffer-equal")
var isnumber = require("isnumber")

module.exports = read
module.exports.Image = Image
module.exports.Frame = Frame

var gifHeader = new Buffer("GIF8")
var pngHeader = new Buffer([137, 80, 78, 71])

function read(buffer, callback) {
  // detect type, convert to format
  // braindead logic: check if GIF or PNG, if not, assume JPG
  var head = buffer.slice(0, 4)
  if (bufferEqual(head, gifHeader)) {
    return parseGif(buffer, callback)
  }
  if (bufferEqual(head, pngHeader)) {
    return parsePng(buffer, callback)
  }
  return parseJpg(buffer, callback)
}

function parseGif(buffer, callback) {
  var image
  try {
    image = new gif.GifReader(buffer)
  } catch (e) {
    return callback(e)
  }
  var img = new Image(image.height, image.width)
  var frameCount = image.numFrames()
  for (var i = 0; i < frameCount; i++) {
    var frameInfo = image.frameInfo(i)
    var rgba = new Buffer(frameInfo.width * frameInfo.height * 4)
    image.decodeAndBlitFrameRGBA(i, rgba)
    img.addFrame(rgba, frameInfo.delay * 10)
  }
  return callback(null, img)
}

function parsePng(buffer, callback) {
  png.parse(buffer, function (err, image) {
    if (err) {
      return callback(err)
    }
    if (image.channels != 4) {
      return callback(new Error("Currently only 4 channel PNGs supported. File an issue if you need this."))
    }
    var img = new Image(image.height, image.width)
    img.addFrame(image.data)
    return callback(null, img)
  })
}

function parseJpg(buffer, callback) {
  var image
  try {
    image = jpeg.decode(buffer)
  } catch (e) {
    return callback(e)
  }
  var img = new Image(image.height, image.width)
  img.addFrame(image.data)
  return callback(null, img)
}

function Image(height, width) {
  if (!(this instanceof Image)) {
    return new Image(height, width)
  }
  if (!isnumber(height) || !isnumber(width)) {
    throw new Error("Image height and width must be numbers.")
  }
  this.height = +height
  this.width = +width
  this.frames = []
}
Image.prototype.addFrame = function (rgba, delay) {
  this.frames.push(new Frame(rgba, delay))
}

function Frame(rgba, delay) {
  if (!(this instanceof Frame)) {
    return new Frame(rgba, delay)
  }
  this.data = rgba
  this.delay = delay
}
