const Web3 = require('web3')
const web3 = new Web3(process.env.ETH_WSS_URL)
const GASLIMIT = 5000000

class ETH {
  constructor(prikey) {
    this.account = web3.eth.accounts.privateKeyToAccount(prikey)
  }

  /**
   * @param {string} toAddress - Destination address to send.
   * @param {string} amount - Amount(Ether) to send.
   * @param {string} gasPrice - Gas price(Gwei) to send.
   */
  async snedETH (toAddress, amount, gasPrice) {
    let tx = {
      from: this.account.address,
      gasPrice: web3.utils.toWei(gasPrice, 'gwei'),
      gas: '21000',
      to: toAddress,
      value: web3.utils.toWei(amount, 'ether')
    }

    return await this.signAndSendTransaction(tx)
  }

  /**
   * @param {string} contractAddress - Destination address to send.
   * @param {string} toAddress - Destination address to send.
   * @param {string} amount - Amount(Ether) to send.
   * @param {string} gasPrice - Gas price(Gwei) to send.
   */
  async sendERC20 (contractAddress, toAddress, amount, gasPrice) {
    let contract = new web3.eth.Contract(JSON.parse(erc20abis[contractAddress]), contractAddress)
    let estimatedGas = await this.estimateGas(contract, toAddress, amount)
    let tx = {
      from: this.account.address,
      gasPrice: web3.utils.toWei(gasPrice, 'gwei'),
      gas: '' + Math.floor(estimatedGas * 1.2),
      to: contractAddress,
      data: contract.methods.transfer(toAddress, amount).encodeABI()
    }
    return await this.signAndSendTransaction(tx)
  }

  estimateGas (contract, toAddress, amount) {
    return new Promise((resolve, reject) => {
      contract.methods.transfer(toAddress, amount).estimateGas({ gas: GASLIMIT }, (err, estimatedGas) => {
        if (err) {
          reject(err)
        } else {
          resolve(estimatedGas)
        }
      })
    })
  }

  signAndSendTransaction (tx) {
    return new Promise((resolve, reject) => {
      this.account.signTransaction(tx, (err, signedRes) => {
        if (!err) {
          // console.time('transactionHash')
          // console.time('receipt')
          // console.time('confirmation')
          console.time('end')
          let gotAConfirmation = false
          web3.eth.sendSignedTransaction(signedRes.rawTransaction, (err, sentRes) => {
            if (err) {
              reject(err)
            }
          }).once('transactionHash', (hash) => {
            // console.timeEnd('transactionHash')
            // console.info('transactionHash', hash)
          }).once('receipt', (receipt) => {
            // console.timeEnd('receipt')
            // console.info('receipt', receipt)
          }).on('confirmation', (confNumber, receipt) => {
            // if (!gotAConfirmation) {
            //   console.timeEnd('confirmation')
            //   gotAConfirmation = true
            //   console.info('confirmation-confNumber', confNumber)
            //   console.info('confirmation-receipt', receipt)
            // }
          }).on('error', (error) => {
            reject(err)
          }).then((receipt) => {
            console.timeEnd('end')
            // console.info('end', receipt)
            resolve(receipt)
          })
        } else {
          reject(err)
        }
      })
    })
  }

  getAddress () {
    return this.account.address
  }

}

const erc20abis = {
  '0x0d8775f648430679a709e98d2b0cb6250d2887ef': "[{\"constant\":true,\"inputs\":[],\"name\":\"batFundDeposit\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_spender\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"batFund\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_from\",\"type\":\"address\"},{\"name\":\"_to\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"tokenExchangeRate\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"finalize\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"version\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"refund\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"tokenCreationCap\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_owner\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"name\":\"balance\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"isFinalized\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"fundingEndBlock\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"ethFundDeposit\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_to\",\"type\":\"address\"},{\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"name\":\"success\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"createTokens\",\"outputs\":[],\"payable\":true,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"tokenCreationMin\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"fundingStartBlock\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"_owner\",\"type\":\"address\"},{\"name\":\"_spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"name\":\"remaining\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"inputs\":[{\"name\":\"_ethFundDeposit\",\"type\":\"address\"},{\"name\":\"_batFundDeposit\",\"type\":\"address\"},{\"name\":\"_fundingStartBlock\",\"type\":\"uint256\"},{\"name\":\"_fundingEndBlock\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"_to\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"LogRefund\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"_to\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"CreateBAT\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"_from\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"_to\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"_owner\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"_spender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"_value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"}]"
}


module.exports = ETH
