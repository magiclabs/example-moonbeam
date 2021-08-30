
# Resources
- [GitHub Repo](https://github.com/magiclabs/example-moonbeam)
- [Demo](https://magic-moonbeam.vercel.app/login)

# Quick Start

```
$ git clone https://github.com/magiclabs/example-moonbeam.git
$ cd example-moonbeam
$ mv .env.example .env // enter your TEST API Key (from https://dashboard.magic.link)
$ yarn install
$ yarn start
```

# Introduction

## What is Moonbeam

[Moonbeam](https://moonbeam.network/) is a developer-focused blockchain aimed at providing compatibility with the existing Ethereum infrastructure. It does this by providing a full EVM implementation, a Web3-compatible API, and bridges that connect Moonbeam to existing Ethereum networks. This allows developers to deploy existing Solidity smart contracts and DApp frontends to Moonbeam with minimal changes.

As a parachain on the Polkadot network, Moonbeam will benefit from the shared security of the Polkadot relay chain and integrations with other chains that are connected to Polkadot (once that functionality is available on Polkadot).

Currently in active development by PureStake, Moonbeam is expected to reach MainNet in the second half of 2021. This guide will show how to use Magic on the public [Moonbase Alpha tesnet](https://docs.moonbeam.network/networks/moonbase/).

With Magic, developers can connect to the Moonbase Alpha testnet by simply specifying the network URL when initiating a Magic instance. This guide will show how you can create a web3-enabled app, allow users to switch between the Ethereum and Moonbase Alpha networks, call smart contracts, and send transactions. 

## Connecting to Ethereum / Moonbeam

In `magic.js`, we will need two `Magic` and two `Web3` instances, one for each network, since we're allowing users to switch between the two. If you're only interested in connecting to Moonbeam, then only one instance of `Magic` and `Web3` should be created. We also are adding `magicEthereum.network = 'ethereum'` to be able to identify the Magic network we're creating.

You’ll use the same API key for both `Magic` instances so that the user’s public address does not change. 

```js
import { Magic } from 'magic-sdk';
import Web3 from 'web3';

const customNodeOptions = {
  rpcUrl: 'https://rpc.testnet.moonbeam.network',
  chainId: 1287
}

// Setting network to Moonbeam Testnet
export const magicMoonbeam = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, { network: customNodeOptions });
magicMoonbeam.network = 'moonbeam'

export const web3Moonbeam = new Web3(magicMoonbeam.rpcProvider);

/** 
 * NOTE: when connecting to a testnet, TEST API keys must be used from the Magic dashboard (live API keys for mainnet)
 */

// Setting network to Ethereum (Rinkeby Testnet)
export const magicEthereum = new Magic(process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, { network: 'rinkeby' });
magicEthereum.network = 'ethereum'

export const web3Ethereum = new Web3(magicEthereum.rpcProvider);
```

## Switching Between Networks

Users will be able to switch between the Ethereum and Moonbeam networks with the `select` element dropdown list. Since one `Magic` instance points towards Ethereum, and the other Moonbeam, we simply update the instance that we’re using for our app based on whichever network the user selects.

```js
import { magicEthereum, magicMoonbeam } from '../magic';

  const [magic, setMagic] = useState(magicEthereum);

  const handleChangeNetwork = (e) => {
    e.target.value === 'ethereum' ? setMagic(magicEthereum) : setMagic(magicMoonbeam);
    fetchBalance(userMetadata.publicAddress);
    fetchContractMessage();
  }

  return (
    <div className='info'>
      <select name='network' onChange={(e) => handleChangeNetwork(e)}>
        <option value='ethereum'>Ethereum Testnet (Rinkeby)</option>
        <option value='moonbeam'>Moonbeam Testnet</option>
      </select>
    </div>
  )
```

## Viewing User Balance

A user's public address will be the same on both Ethereum and Moonbeam (as long as you are using the same API key for each instance) so a simple `web3.eth.getBalance` call is all that is needed for either network.

```js
const fetchBalance = (address) => {
  web3.eth.getBalance(address).then(bal => setBalance(web3.utils.fromWei(bal)))
}

return (
<h1>Balance</h1>
<div className="info">
  {balance.toString().substring(0, 6)} {magic.network === 'moonbeam' ? 'DEV' : 'ETH'}
</div>
)
```

## Send Transaction

Sending a transaction is also very simple and similar for both networks. The gas limit can be hard-coded in as 21000.

```js
const web3 = magic.network === "ethereum" ? web3Ethereum : web3Moonbeam;

const sendTransaction = async () => {
  if (!toAddress || !amount) return;
  const { transactionHash } = await web3.eth.sendTransaction({
    from: publicAddress,
    to: toAddress,
    value: web3.utils.toWei(amount),
    gas: 21000
  });
}

return (
 <div className="container">
  <h1>Send Transaction</h1>
  <input 
    type="text" 
    value={toAddress} 
    onChange={(e) => setToAddress(e.target.value)} 
    placeholder="To Address" 
  />
  <input 
    type="text" 
    value={amount} 
    onChange={(e) => setAmount(e.target.value)} 
    placeholder="Amount" 
  />
  <button onClick={sendTransaction}>Send Transaction</button>
</div>
)
```

## Calling Smart Contracts

Separate smart contracts will need to be deployed on each Ethereum and Moonbeam for your users to interact with them, so you'll need to know the address of each in order to call it. 

```js
const [message, setMessage] = useState('...');
const [newMessage, setNewMessage] = useState('');
const network = magic.network === 'ethereum' ? 'ethereum' : 'moonbeam';
const ethContractAddress = '0x5b7D039DaE8D61CC3393fc9eAE42014D0C2CE689';
const moonbeamContractAddress = '0x8389bb98FcE80c444190A3Ec7d0e0673032771F6';
const contract = new web3.eth.Contract(abi, network === 'ethereum' ? ethContractAddress : moonbeamContractAddress);

// Grabbing `message` variable value stored in the smart contract
const fetchContractMessage = () => contract.methods.message().call().then(setMessage);

// Update contract `message` value on the blockchain
const updateContractMessage = async () => {
  if (!newMessage) return;

  // Estimate Gas Limit
  let gasLimit = await contract.methods.update(newMessage).estimateGas({});

  const { transactionHash } = await contract.methods.update(newMessage).send({ 
    from: publicAddress, 
    gasLimit,
  });
}

return (
  <h1>Contract Message</h1>
  <div className="info">{message}</div>

  <h1>Update Message</h1>
  <input 
    type="text" 
    value={newMessage} 
    onChange={(e) => setNewMessage(e.target.value)} 
    placeholder="New Message" />

  <button onClick={updateContractMessage}>Update</button>
)
```

## Done

That's all there is to it! You've now got an app that allows users to create a wallet with just their email, and switch between the Moonbeam and Ethereum networks within your app.
