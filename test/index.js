"use strict";

var test = require("tape")
var fs = require("fs")
var readimage = require("../readimage")
var readfile = function (filename) {
  return fs.readFileSync(__dirname + "/" + filename)
}

test("png", function (t) {
  var buf = readfile("../examples/ravenwall.png")
  readimage(buf, function (err, image) {
    if (err) {
      t.fail(err)
    }
    t.equals(image.height, 458, "yep, height")
    t.equals(image.width, 270, "yep, width")
    t.equals(image.frames.length, 1)
    t.equals(image.frames[0].data.length, image.height * image.width * 4, "right data length")
    t.end()
  })
})

test("jpg", function (t) {
  var buf = readfile("../examples/autocorrect.jpg")
  readimage(buf, function (err, image) {
    if (err) {
      t.fail(err)
    }
    t.equals(image.height, 640, "yep, height")
    t.equals(image.width, 640, "yep, width")
    t.equals(image.frames.length, 1)
    t.equals(image.frames[0].data.length, image.height * image.width * 4, "right data length")
    t.end()
  })
})


test("gif", function (t) {
  var buf = readfile("../examples/doge_jump2.gif")
  readimage(buf, function (err, image) {
    if (err) {
      t.fail(err)
    }
    t.equals(image.height, 101, "yep, height")
    t.equals(image.width, 135, "yep, width")
    t.equals(image.frames.length, 30)
    t.equals(image.frames[0].data.length, image.height * image.width * 4, "right data length")
    t.end()
  })
})
