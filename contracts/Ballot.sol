// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.7.0 < 0.9.0;

//create a smart contract call Ballot
contract Ballot{
//This struct function is a variable that contains many features
//define a voter in this ballot

struct Voter{
    uint weight;
    bool voted;
    address delegate;
    uint vote;
}

struct Proposal{
    bytes32 name; //the name of proposal
    uint voteCount; //how many votes that specific proposal recieved


}

address public chairperson;
mapping (address => Voter) public voters;

Proposal[] public proposals;

constructor(bytes32[] memory proposalNames){
    chairperson = msg.sender;
    voters[chairperson].weight = 1;

    for (uint i = 0; i<proposalNames.length; i++){
        proposals.push(Proposal({
            name: proposalNames[i],
            voteCount:0
        }));
    }
}


function giveRighttoVote(address voter) external {
    require(
        msg.sender == chairperson,
        "Only Chairperson allowed to assign voting rights."
    );

    require(
        !voters[voter].voted,
        "Voter already voted once."
    );
    require(voters[voter].weight == 0);

    
    voters[voter].weight = 1;
}

function removeVotingRights(address voter) external {
    require(msg.sender == chairperson, "Only Chairperson allowed to remove voting rights.");
    require(!voters[voter].voted, "Voter cannot be removed while vote is active.");
    require(voters[voter].weight == 1);
    voters[voter].weight = 0;

}


function delegate(address to) external {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted, "You already voted once.");

    require(to != msg.sender, "Self-delegation is not allowed.");

    while (voters[to].delegate !=address(0)){
        to = voters[to].delegate;
        require(to !=msg.sender, "Found loop during Delegation.");

    }

    sender.voted = true;
    sender.delegate = to;
    Voter storage delegate_ = voters[to];
    if (delegate_.voted){
        proposals[delegate_.vote].voteCount += sender.weight;

    } else {
        delegate_.weight += sender.weight;
    }
}
function vote(uint proposal) external {
    Voter storage sender = voters[msg.sender];
    require(sender.weight != 0, "No right to vote");
    require(!sender.voted, "Already voted once.");
    sender.voted = true;
    sender.vote = proposal;

    proposals[proposal].voteCount += sender.weight;
}

function winningProposal() public view
    returns (uint winningProposal_)
{
    uint winningVoteCount = 0;
    for (uint p = 0; p < proposals.length; p++){
        if(proposals[p].voteCount > winningVoteCount){
            winningVoteCount = proposals[p].voteCount;
            winningProposal_ = p;
        }
    }
}

function winnerName() external view
    returns (bytes32 winnerName_)

    {
        winnerName_ = proposals[winningProposal()].name;
    }

}