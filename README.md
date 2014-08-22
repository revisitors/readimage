readimage
=====

[![NPM](https://nodei.co/npm/readimage.png)](https://nodei.co/npm/readimage/)

Read an image into memory converting from whatever format it is in to a consistent set of RGBA frames independent on input format.

Why? Because image formats are a pain to worry about.

How fast is it? Not really sure. I don't need it to be fast.

How robust is it? Not really sure, if you have issues please file them!


```javascript

var fs = require("fs")
var readimage = require("readimage")

var filedata = fs.readFileSync("cat.png")

readimage(filedata, function (err, image) {
  if (err) {
    console.log("failed to parse the image")
    console.log(err)
  }
  console.log(image)
})

```

API
===

`require("readimage")(imageBuffer, callback)`
---

Read a buffer containing an image in PNG, GIF, or JPG format into a consistent RGBA format.

FORMAT
===

height, width, and an array of sequential frames. Non-animated images will have a single frame.

```js
{
  height: 100, // pixels
  width: 100, // pixels
  frames: [
    {
      data: ... // RGBA buffer
      delay: 100 // milliseconds before switching to next frame. OPTIONAL
    },
    {
      data: ...
      delay: 10
    }
  ]
}
```

LICENSE
=======

MIT
