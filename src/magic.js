import { Magic } from 'magic-sdk';
import Web3 from 'web3';

const customNodeOptions = {
  rpcUrl: 'https://rpc.testnet.moonbeam.network',
  chainId: 1287
}

// Setting network to Moonriver Testnet
export const magicMoonriver = new Magic('pk_test_0A96BC0C8B04200F', { network: customNodeOptions });
magicMoonriver.network = 'moonriver'

export const web3Moonriver = new Web3(magicMoonriver.rpcProvider);

/** 
 * NOTE: when connecting to a testnet, TEST API keys must be used from the Magic dashboard (live API keys for mainnet)
 */

// Setting network to Ethereum (Rinkeby Testnet)
export const magicEthereum = new Magic('pk_test_0A96BC0C8B04200F', { network: 'rinkeby' });
magicEthereum.network = 'ethereum'

export const web3Ethereum = new Web3(magicEthereum.rpcProvider);