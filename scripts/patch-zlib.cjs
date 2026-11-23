/* eslint-disable @typescript-eslint/no-require-imports */
// Polyfill for Node.js environments lacking zlib.createZstdDecompress (e.g. Node < 22.14)
// Required by undici 8.x in decompress.js
const zlib = require('node:zlib');

if (typeof zlib.createZstdDecompress !== 'function') {
  zlib.createZstdDecompress = function () {
    const { PassThrough } = require('node:stream');
    return new PassThrough();
  };
}

if (!zlib.constants) {
  zlib.constants = {};
}

if (zlib.constants.ZSTD_d_windowLogMax === undefined) {
  zlib.constants.ZSTD_d_windowLogMax = 23;
}
