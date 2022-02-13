import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contract/legacyProject.json";

function App() {
  const contractAddress='0x9867588Cf0A391b91597408b500073Bc39DF3Fe9';
  const contractABI=abi.abi;

  const [isWallectConnect,setWallectConnet]=useState(false);
  const [inputValue,setInPutValue]=useState({inher:"",_days:"",_periods:"",_intervalTime:"",legacyAmount:"",dayForReset:"",ownerAddress:"",owneraddTogetinfo:""});
  const [yourWalletAddress,setYourWalletAddress]=useState(null);
  const [inheritor,setInheritor]=useState(null);
  const [legacyValue,setLegacyValue]=useState(0);
  const [timer,setTimer]=useState(0);
  const [periods,setperiods]=useState(0);
  const [intervalTime,setintervalTime]=useState(0);
  const [amountPerPeriod,setamountPerPeriod]=useState(0);

  const [error, setError] = useState(null);

  const checkWalletConnect=async()=>{
    try{
      if (window.ethereum){
      const accounts=await window.ethereum.request({method: 'eth_requestAccounts'})
      const account = accounts[0];
      setWallectConnet(true);
      setYourWalletAddress(account);
      console.log("Account Connected: ", account);
    }else{
      setError("Install a MetaMask wallet.");
      console.log("No Metamask detected");
      }
    }catch(error){
      console.log(error);
    }
  }
  const getTokenInfo=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const legacyContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        let txn=await legacyContract.inheritor(inputValue.owneraddTogetinfo);
        let txn1=await legacyContract.legacyValue(inputValue.owneraddTogetinfo);
        let txn2=await legacyContract.timer(inputValue.owneraddTogetinfo);
        let txn3=await legacyContract.periods(inputValue.owneraddTogetinfo);
        let txn4=await legacyContract.intervalTime(inputValue.owneraddTogetinfo);
        let txn5=await legacyContract.amountPerPeriod(inputValue.owneraddTogetinfo);
        txn1=utils.formatEther(txn1);
        let date=new Date(txn2*1000);
        txn2=date.toLocaleDateString("en-US");
        txn3=txn3.toString();
        txn4=txn4.toString();
        txn5=utils.formatEther(txn5);
        console.log("searching");
        setInheritor(txn);
        setLegacyValue(txn1);
        setTimer(txn2);
        setperiods(txn3);
        setintervalTime(txn4);
        setamountPerPeriod(txn5);
        console.log("done");
      }
    }catch(error){
      console.log(error);
    }
  }
  const setLegacy=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const legacyContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await legacyContract.setLegacy(inputValue.inher,inputValue._days,inputValue._periods,inputValue._intervalTime,{ value: ethers.utils.parseEther(inputValue.legacyAmount) });
        console.log("setting");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const ownerWithdraw=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const legacyContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await legacyContract.ownerWithdraw();
        console.log("withdrawing");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const resetTimer=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const legacyContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await legacyContract.resetTimer(inputValue.dayForReset);
        console.log("resetting");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const inheritorClaim=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const legacyContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await legacyContract.inheritorClaim(inputValue.ownerAddress);
        console.log("claiming");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
        setError("Install a MetaMask wallet.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const handleInputChange = (event) => {
    setInPutValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  };
  useEffect(() => {
    checkWalletConnect();
  }, [])
  return (
    <main>
      {error &&<p>{error}</p>}
      <h2>legacy project DAPP</h2>
      <div>
        {isWallectConnect &&(<p>your address:{yourWalletAddress} </p>)}
        {!isWallectConnect &&(<button onClick={checkWalletConnect}> connect wallet </button>)}
      </div>
      <div>
        <h4>get informaton</h4>
        <p>inser legacy owner's address to view the detail.</p>
        <input
          type="text"
          onChange={handleInputChange}
          name="owneraddTogetinfo"
          placeholder="input owner's address"
          value={inputValue.owneraddTogetinfo}/>
          <button onClick={getTokenInfo}>get info</button>
          <p>inheritor: {inheritor}</p>
          <p>legacy Value:{legacyValue} ETH</p>
          <p>expect next claim date: {timer}</p>
          <p>how many periods:{periods}</p>
          <p>interval Time:{intervalTime} days</p>
          <p>how much can be claimed each period: {amountPerPeriod} ETH</p>
      </div>
      <div>
          <h4>creat your own legacy contract.</h4>
          <p>1. assign who will be the inheritor.</p>
          <p>2. insert how much ETH you want to be the legacy.</p>
          <p>3. insert how many instalments you would like this contract to pay your legacy to your inheritor after your pass away?</p>
          <p>4. insert how long between each period?(unit:days)</p>
          <p>5. insert the time limit, and the contract will consider you are passed away if you do not come back and reset the timer within the time limit.(unit:days)</p>
          <input
          type="text"
          onChange={handleInputChange}
          name="inher"
          placeholder="assign inheritor"
          value={inputValue.inher}/>
          <input
          type="text"
          onChange={handleInputChange}
          name="legacyAmount"
          placeholder="set legacy amount"
          value={inputValue.legacyAmount}/>
          <input
          type="text"
          onChange={handleInputChange}
          name="_periods"
          placeholder="set how many periods"
          value={inputValue._periods}/>
          <input
          type="text"
          onChange={handleInputChange}
          name="_intervalTime"
          placeholder="time between each period"
          value={inputValue._intervalTime}/>
          <input
          type="text"
          onChange={handleInputChange}
          name="_days"
          placeholder="checking time"
          value={inputValue._days}/>
          <button onClick={setLegacy}>set legacy</button>
      </div>
      <div>
        <h4>if owner want to withdraw money and cancel contract</h4>
        <button onClick={ownerWithdraw}>owner withdraw money</button>
      </div>
      <div>
        <h4>owner can prove he/she is still alive, and reset the time limit.(uint:days)</h4>
        <input
          type="text"
          onChange={handleInputChange}
          name="dayForReset"
          placeholder="next checking time"
          value={inputValue.dayForReset}/>
        <button onClick={resetTimer}>reset</button>
      </div>
      <div>
        <h4>inheritor can claim the legacy</h4>
        <p>please check the expect time for claim first</p>
        <input
          type="text"
          onChange={handleInputChange}
          name="ownerAddress"
          placeholder="legacy owner's address"
          value={inputValue.ownerAddress}/>
        <button onClick={inheritorClaim}>claim</button>
      </div>
    </main>
  );
}

export default App;
