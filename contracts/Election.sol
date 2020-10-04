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
    //mapping is key => value pairs 
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    
    //uint public candidateId;
   
    Candidate public winner;
    
    //sets deployer of contract as its manager
    constructor() public {
        manager = msg.sender;
    }

    
    //restricts action to manager if used otherwise causes error
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    //manager adds candidates with default values
    function addCandidate(uint _id, string memory _name) public restricted{
        Candidate memory newCandidate = Candidate({
            name: _name,
            id: _id,
            voteCount: 0
        });

        candidatesCount++;
        candidates[candidatesCount] =  newCandidate;
    }
    
    //manager adds voters with default values
    function addVoter(uint _id, string memory _name, address _address) public restricted{
        Voter memory newVoter = Voter({
            exists : false,
            voted: false,
            name: _name,
            id: _id
           
        });

        votersCount++;
        voters[_address] = newVoter;
        voters[_address].exists = true;
    }

    //Voters can vote only once
    function vote(uint _candidateId) public {
        require(voters[msg.sender].exists);
        require(voters[msg.sender].voted == false);

        voters[msg.sender].voted = true;
        candidates[_candidateId].voteCount++;

    }

    //manager declares the winner
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