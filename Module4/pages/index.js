import { useState, useEffect } from "react";
import styles from '../styles/style.module.css';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { acctFactoryAddress } from "../contractAddress";
import SimpleAccountFactory from "../artifacts/contracts/samples/SimpleAccountFactory.sol/SimpleAccountFactory.json";

export default function HomePage() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState(null);
  const [address, setAddress] = useState(null);
  const [amountInput, updateAmountInput] = useState("");  
  const [addressInput, updateAddressInput] = useState("");
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    // Create a Web3Modal instance
    const web3Modal = new Web3Modal();

    // Connect to the user's Ethereum provider
    web3Modal.connect().then(async (provider) => {
      // Create an ethers.js provider using the Web3 provider
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      setProvider(ethersProvider);
      const signer = await ethersProvider.getSigner();
      const signerAddress = await signer.getAddress();
      const salt = 5;

      // Create an instance of the contract using the contract ABI and address
      const acctContract = new ethers.Contract(
        acctFactoryAddress,
        SimpleAccountFactory.abi,
        ethersProvider.getSigner()
      );
      setContract(acctContract);

      const createAccount = await acctContract.createAccount(signerAddress, salt);
      console.log("Account created", createAccount);
      const getAccount = await acctContract.getCreatedAddress(signerAddress, salt);
      console.log(getAccount);
      setAddress(getAccount);
      let balance = await acctContract.getDeposit(getAccount);
      balance = ethers.utils.formatEther(balance);
      setBalance(balance);
      setLoadingState(true);
    });
  }, []);

  const addFund = async (e) => {
    try {
      e.preventDefault();
      const amount = ethers.utils.parseEther(amountInput);
      const accountTx = await contract.addDeposit(address, { value: amount });
      const receipt = await accountTx.wait();
      if (receipt.status === 1) {
        alert('Funding successful');
      }
      else {
        alert('Funding failed');
        return
      }
      let balance = await contract.getDeposit(address);
      balance = ethers.utils.formatEther(balance);
      setBalance(balance);
    }
    catch (error) {
      console.log(error);
    }
  };
  
  const sendFund = async (e) => {
    try {
      e.preventDefault();
      const amount = ethers.utils.parseEther(amountInput);
      const accountTx = await contract.sendFund(address, addressInput, amount);
      const receipt = await accountTx.wait();
      if (receipt.status === 1) {
        alert('Transfer successful');
      }
      else {
        alert('Transfer failed');
        return
      }
      let balance = await contract.getDeposit(address);
      balance = ethers.utils.formatEther(balance);
      setBalance(balance);
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    <main className={styles.main}>
      {provider && (
        <>
            {loadingState === false ? (
              <p>Loading...</p>
            ):(
              <div className={styles.container}>
                <h3>SarahAnnie Wallet</h3>
                {address === null || address === undefined ? 
                  (<></>):(<p>Address:<br/><small className={styles.small}>{address}</small></p>)              
                }
                <p>Balance: {balance}</p>
                <input
                  type="number"
                  step="0.000001"
                  inputMode="decimal"
                  placeholder="Amount"
                  className={styles.input}
                  onChange={e => updateAmountInput(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Input Address if you want to send"
                  className={styles.input}
                  onChange={e => updateAddressInput(e.target.value)}
                />
                <div className={styles.buttondiv}>
                  <button className={styles.button} type="button" onClick={addFund}>Fund Wallet</button>
                  <button className={styles.button} type="button" onClick={sendFund}>Send Funds</button>
                </div>
              </div>
            )}
        </>
      )}
    </main>
  )
}
