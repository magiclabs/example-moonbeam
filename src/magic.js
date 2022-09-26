import { Magic } from 'magic-sdk';
import Web3 from 'web3';

const customNodeOptions = {
  rpcUrl: 'https://rpc.testnet.moonbeam.network',
  chainId: 1287,
};

// Setting network to Moonbeam Testnet
export const magicMoonbeam = new Magic(
  process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, 
  { 
    network: customNodeOptions,
  },
);
magicMoonbeam.network = 'moonbeam';

export const web3Moonbeam = new Web3(magicMoonbeam.rpcProvider);

// Setting network to Ethereum (Goerli Testnet)
export const magicEthereum = new Magic(
  process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, 
  { 
    network: 'goerli',
  },
);
magicEthereum.network = 'ethereum';

export const web3Ethereum = new Web3(magicEthereum.rpcProvider);
