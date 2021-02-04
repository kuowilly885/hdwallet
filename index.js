require('dotenv').config()
const HD = require('./HD')
const ETH = require('./ETH')

const run = async () => {

  let hdFrom = HD.getHDFromSeed(process.env.HD_SEED_FROM)
  let hdTo = HD.getHDFromSeed(process.env.HD_SEED_TO)

  let ethFrom = new ETH(hdFrom.prikey)
  let ethTo = new ETH(hdTo.prikey)

  console.info('from addr: ', ethFrom.getAddress())
  console.info('to addr: ', ethTo.getAddress())
  console.info('sending ...')

  // let receipt = await ethFrom.snedETH(ethTo.getAddress(), '0.001', '111')
  let receipt = await ethFrom.sendERC20('0x0d8775f648430679a709e98d2b0cb6250d2887ef', ethTo.getAddress(), '5', '180')
  console.info('receipt', receipt)

  process.exit()
}

run()
















// web3.eth.signTransaction({
//     from: "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0",
//     gasPrice: "20000000000",
//     gas: "21000",
//     to: '0x3535353535353535353535353535353535353535',
//     value: "1000000000000000000",
//     data: ""
// }).then(console.log);
