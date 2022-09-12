import { Magic } from 'magic-sdk';
import Web3 from 'web3';

const customNodeOptions = {
  rpcUrl: 'https://rpc.testnet.moonbeam.network',
  chainId: 1287
}

// Setting network to Moonbeam Testnet
export const magicMoonbeam = new Magic(
  process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, 
  { 
    network: customNodeOptions 
  }
);
magicMoonbeam.network = 'moonbeam'

export const web3Moonbeam = new Web3(magicMoonbeam.rpcProvider);

/** 
 * NOTE: when connecting to a testnet, TEST API keys must be used from the Magic dashboard (live API keys for mainnet)
 */

// Setting network to Ethereum via Custom Node (Goerli Testnet)
export const magicEthereum = new Magic(
  process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, 
  { 
    network: {
      rpcURL: 'https://eth-goerli.g.alchemy.com/v2/K2PvBhxr80z5cRNJ9-Kc-PG2GiLJaU6l',
      chainId: 5,
    },
  }
);
magicEthereum.network = 'ethereum'

export const web3Ethereum = new Web3(magicEthereum.rpcProvider);
