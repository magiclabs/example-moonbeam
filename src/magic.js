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

// Setting network to Ethereum via Custom Node (Goerli Testnet)
export const magicEthereum = new Magic(
  process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY, 
  { 
    network: {
      rpcURL: `https://eth-goerli.g.alchemy.com/v2/${REACT_APP_ALCHEMY_API_KEY}`,
      chainId: 5,
    },
  },
);
magicEthereum.network = 'ethereum';

export const web3Ethereum = new Web3(magicEthereum.rpcProvider);