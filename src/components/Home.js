import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { magicEthereum, magicMoonriver, web3Ethereum, web3Moonriver } from '../magic';
import { abi } from '../contract/abi.js';
import Loading from './Loading';
import ContractCall from './ContractCall';
import SendTransaction from './SendTransaction';
import Info from './Info';

export default function Home() {
  const [magic, setMagic] = useState(magicEthereum);
  const web3 = magic.network === 'ethereum' ? web3Ethereum : web3Moonriver;
  const [userMetadata, setUserMetadata] = useState();
  const [balance, setBalance] = useState('...');
  const network = magic.network === 'ethereum' ? 'ethereum' : 'moonriver';
  const ethContractAddress = '0x5b7D039DaE8D61CC3393fc9eAE42014D0C2CE689';
  const moonriverContractAddress = '0x8389bb98FcE80c444190A3Ec7d0e0673032771F6';
  const contract = new web3.eth.Contract(abi, network === 'ethereum' ? ethContractAddress : moonriverContractAddress);
  const [message, setMessage] = useState('...');
  const history = useHistory();

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile, balance and contract message.
    magic.user.isLoggedIn().then(magicIsLoggedIn => {
      if (magicIsLoggedIn) {
        magic.user.getMetadata().then(user => {
          setUserMetadata(user);
          fetchBalance(user.publicAddress);
          fetchContractMessage();
        });
      } else {
        // If no user is logged in, redirect to `/login`
        history.push('/login');
      }
    });
  }, [magic]);

   const handleChangeNetwork = (e) => {
    e.target.value === 'ethereum' ? setMagic(magicEthereum) : setMagic(magicMoonriver);
    fetchBalance(userMetadata.publicAddress);
    fetchContractMessage();
  }

  const fetchBalance = (address) => {
    web3.eth.getBalance(address).then(bal => setBalance(web3.utils.fromWei(bal)))
  }

  const fetchContractMessage = () => contract.methods.message().call().then(setMessage)

  return (
    userMetadata ? (
      <>
        <Info handleChangeNetwork={handleChangeNetwork} balance={balance} user={userMetadata} magic={magic} />
        <SendTransaction web3={web3} network={network} publicAddress={userMetadata.publicAddress} fetchBalance={fetchBalance} />
        <ContractCall web3={web3} network={network} contract={contract} publicAddress={userMetadata.publicAddress} fetchBalance={fetchBalance} message={message} fetchContractMessage={fetchContractMessage} />  
      </>
    ) : <Loading />
  );
}

