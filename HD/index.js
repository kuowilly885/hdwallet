const lib = require('bitcore-lib')

/**
 * @param {string} seed - A random phrase.
 */
const getHDFromSeed = (seed) => {
  let hd = {
    xpubkey: '',
    path: 'm/0/0',
    pubkey: '',
    prikey: ''
  }
  let buffSeed = Buffer.from(seed)
  let hexSeed = buffSeed.toString('hex')
  let hdprikey = lib.HDPrivateKey.fromSeed(hexSeed);
  hd.xpubkey = hdprikey.xpubkey

  const baseStr = 'm/0/'
  let seq = 0
  let hdpubkey = new lib.HDPublicKey(hdprikey.xpubkey)
  hd.pubkey = hdpubkey.deriveChild(baseStr + (seq)).toObject().publicKey
  hd.prikey = hdprikey.deriveChild(baseStr + (seq)).toObject().privateKey

  return hd
}

module.exports = {
  getHDFromSeed
}
