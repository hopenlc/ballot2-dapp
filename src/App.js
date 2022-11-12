import './App.css';
import {useState} from 'react';
import {ethers} from 'ethers';
import Ballot from './artifacts/contracts/Ballot.sol/Ballot.json'

const ballotAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
 const [address, voterAddress] = useState()
 const [voteAddress, checkAddress] = useState()
 const [proposal, getProposals] = useState()
 const [delAddress, delVoterAddress] = useState()
 const [removeVoter, removeVoterRights] = useState()
 const [selProposal, chosenProposal] = useState()

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

  async function checkProposal(){
    if(!proposal) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider)
    try {
      const data = await contract.proposals(proposal)
      console.log('Proposal Name: ', data)
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

  async function delegateAddr(){ //connect to the smart contract and give the right to vote
    if(!delAddress) return // check to see if an address was provided
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()  
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer)
      const transaction = await contract.delegate(delAddress)
      await transaction.wait()
      console.log('Delegating Your Vote: ', transaction)
    }  
  }


  async function removeVotersRights(){ //connect to the smart contract and give the right to vote
    if(!removeVoter) return // check to see if an address was provided
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()  
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer)
      const transaction = await contract.removeVotingRights(removeVoter)
      await transaction.wait()
      console.log('Removing Addresses Rights to Vote ', transaction)
    }  
  }

  async function voteForProposal(){ //connect to the smart contract and give the right to vote
    if(!selProposal) return // check to see if an address was provided
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()  
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log({ provider })
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ballotAddress, Ballot.abi, signer)
      const transaction = await contract.vote(selProposal)
      await transaction.wait()
      console.log('You voted for: ', transaction)
    }  
  }


  async function whoIsWinning(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider)
    try {
      const data = await contract.winningProposal()
      console.log('Who is Winning?: ', data)
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  async function whoWon(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(ballotAddress, Ballot.abi, provider)
    try {
      const data = await contract.winnerName()
      console.log('Winning Proposal: ', data)
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Voting Application </h1>
        <h3>Contract Address: {ballotAddress}</h3>
        <button onClick={whoischair}>Chairperson?</button>
        <br></br>
        <button onClick={checkProposal}>Proposal Names</button>
        <input onChange={e => getProposals(e.target.value)} placeholder="Proposal Name" />
        <br></br>
        <button onClick={rightToVote}>Give Voting Rights</button>
        <input onChange={e => voterAddress(e.target.value)} placeholder="Voter Address" />
        <br></br>
        <button onClick={removeVotersRights}>Remove Voting Rights</button>
        <input onChange={e => removeVoterRights(e.target.value)} placeholder="Voter Address to Remove" />
        <br></br>
        <button onClick={delegateAddr}>Delegate Your Vote</button>
        <input onChange={e => delVoterAddress(e.target.value)} placeholder="Delegate Address" />
        <br></br>
        <button onClick={checkVoter}>Check Voter</button>
        <input onChange={e => checkAddress(e.target.value)} placeholder="Check Voter Address" />
        <br></br>
        <button onClick={voteForProposal}>Vote for Proposal</button>
        <input onChange={e => chosenProposal(e.target.value)} placeholder="Proposal Number" />
        <br></br>
        <button onClick={whoIsWinning}>Who is Winning?</button>
        <br></br>
        <button onClick={whoWon}>Who Won?</button>   
        <br></br>    
      </header>
    </div>
  );
}

export default App;
