pragma solidity 0.5.16;

contract Election {
    uint public votersCount = 0;
    uint public candidatesCount= 0;
    address public manager;
        


    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool exists;
        uint id;
        string name;
        bool voted;
    }
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    //mapping(address => bool) public voterExists;
    uint public candidateId;
    event VotedEvent(
        uint indexed candidateId    
    );

    Candidate public winner;

    constructor() public {
        manager = msg.sender;


    }

    
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function addCandidate(uint _id, string memory _name) public restricted{
        Candidate memory newCandidate = Candidate({
            name: _name,
            id: _id,
            voteCount: 0
        });

        candidatesCount++;
        candidates[candidatesCount] =  newCandidate;
    }

    function addVoter(uint _id, string memory _name) public restricted{
        Voter memory newVoter = Voter({
            exists : false,
            name: _name,
            id: _id,
            voted: false
        });

        votersCount++;
        voters[msg.sender] = newVoter;
        voters[msg.sender].exists = true;
    }

    function vote(uint _candidateId) public {
        require(voters[msg.sender].exists);
        require(voters[msg.sender].voted == false);
        voters[msg.sender].voted = true;
        candidates[_candidateId].voteCount++;

        emit VotedEvent(_candidateId);
    }

    
    function finalizeResult() public restricted {
        uint maxIndex = 0;
        for (uint i = 1; i < candidatesCount; i++) {
            if(candidates[i].voteCount > candidates[maxIndex].voteCount){
                maxIndex = i;
            }    
        
        winner = candidates[maxIndex];

        }   
    }
    
       
}