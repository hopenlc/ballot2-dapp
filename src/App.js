import './App.css';
import {useState} from 'react';
import {ethers} from 'ethers';
import Ballot from './artifacts/contracts/Ballot.sol/Ballot.json'

const ballotAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
 const [address, voterAddress] = useState()
 const [voteAddress, checkAddress] = useState()

  async function requestAccount(){ //connect to the metamask wallet of a user
    await window.ethereum.request({method: 'eth_requestAccounts'}); //request account info and promp connection of a metamask account
  }

  async function whoischair(){ //who is the chairperson for the contract
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider)
    try {
      const data = await contract.chairperson()
      console.log('Chairperson: ', data)
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  async function rightToVote(){ //connect to the smart contract and give the right to vote
    if(!address) return // check to see if an address was provided
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()  
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer)
      const transaction = await contract.giveRighttoVote(address)
      await transaction.wait()
      console.log('Giving Right to Vote: ', transaction)
    }  
  }

  async function checkVoter(){
    if(!voteAddress) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider)
    try {
      const data = await contract.voters(voteAddress)
      console.log('Check Voter: ', data)
    } catch (err) {
      console.log("Error: ", err)
    }
  }

//async function removeVotingRights(){}

//async function removeVotingRights(){}

//async function delegate(){}

//async function vote(){}

//async function winningProposal(){}

//async function winnerName(){}

  return (
    <div className="App">
      <header className="App-header">
        <h1>Voting Application </h1>
        <h3>Contract Address: {ballotAddress}</h3>
        <button onClick={whoischair}>Chairperson?</button>
        <br></br>
        <button onClick={rightToVote}>Give Voting Rights</button>
        <input onChange={e => voterAddress(e.target.value)} placeholder="Voter Address" />
        <br></br>
        <button onClick={checkVoter}>Check Voter</button>
        <input onChange={e => checkAddress(e.target.value)} placeholder="Check Voter Address" />
      </header>
    </div>
  );
}

export default App;
