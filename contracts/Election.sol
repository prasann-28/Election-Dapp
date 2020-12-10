pragma solidity 0.5.16;

// contract ElectionFactory{
//     address[] public deployedElections;
//     function createElection() public {
//         address newElection = address( new Election(msg.sender));
//         deployedElections.push(newElection);
//     }
//     function getDeployedElections() public view returns (address[] memory){
//         return deployedElections;
//     } 
// }
contract Election {
    uint public votersCount = 0;
    uint public candidatesCount= 0;
    address public manager;
    uint public imageCount = 0;
    uint public votesCast = 0;

    
        
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
        bool exists;
        string party;
        string agenda;
    }

    struct Image{
        uint id;
        string imghash;
        string description;

    }

    struct Voter {
        bool exists;
        uint id;
        string name;
        bool voted;
        string password;
        bool authenticated;
    }
    //mapping is key => value pairs 
    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;
    mapping(uint => Image) public images;
    //uint public candidateId;
   
    Candidate public winner;
    
    //sets deployer of contract as its manager
    //constructor(address _manager) public {
    constructor() public {
    
        manager = msg.sender;
    }

    
    //restricts action to manager if used otherwise causes error
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    //manager adds candidates with default values
    function addCandidate(uint _id, string memory _name, string memory _party, string memory _agenda) public restricted{
        require(!candidates[_id].exists);
        Candidate memory newCandidate = Candidate({
            name: _name,
            id: _id,
            voteCount: 0,
            exists: true,
            party: _party,
            agenda: _agenda
        });

        ++candidatesCount;

        require(candidatesCount == _id);
        candidates[candidatesCount] =  newCandidate;
    }
    
    //manager adds voters with default values
    function register(string memory _name, string memory _password) public {
        require(!voters[msg.sender].exists);
        
        Voter memory newVoter = Voter({
            exists : false,
            voted: false,
            name: _name,
            id: 0,
            password: _password,
            authenticated: false
 
        });

        votersCount++;
        voters[msg.sender] = newVoter;
        voters[msg.sender].id = votersCount;
        voters[msg.sender].exists = true;
    }

    //lets voters set passwords
    function setVoterPassword(string memory _pass) public {
        require(voters[msg.sender].id!=0);
        require(voters[msg.sender].exists);
        require(!voters[msg.sender].authenticated);
        //to check strings
        //require((keccak256(abi.encodePacked(voters[msg.sender].password)) == keccak256(abi.encodePacked('dfault'))));

        voters[msg.sender].password = _pass;
    }

    //Voter authentication
    function authenticate(uint _id,string memory _pass) public {
        require(voters[msg.sender].exists);
        require(!voters[msg.sender].voted);
        require((keccak256(abi.encodePacked(voters[msg.sender].password)) == keccak256(abi.encodePacked(_pass))));
        require(voters[msg.sender].id == _id);

        //(keccak256(abi.encodePacked(voters[msg.sender].password)) == keccak256(abi.encodePacked(_pass)));
        voters[msg.sender].authenticated = true;
    }

    //Voters can vote only once
    function vote(uint _candidateId) public {
        require(voters[msg.sender].exists);
        require(voters[msg.sender].authenticated);
        require(voters[msg.sender].voted == false);

        voters[msg.sender].voted = true;
        candidates[_candidateId].voteCount++;
        votesCast++;
    }

    //only manager declares the winner
    function finalizeResult() public restricted {
        uint maxIndex = 1;
        for (uint i = 1; i < candidatesCount; i++) {
            if(candidates[i].voteCount > candidates[maxIndex].voteCount){
                maxIndex = i;
            }    
        
        winner = candidates[maxIndex];

        }   
    }

    
  event ImageCreated(
    uint id,
    string imghash,
    string description
  );

    function uploadImage(uint _id, string memory _imgHash, string memory _description) public restricted {
    // Make sure the image hash exists
    require(bytes(_imgHash).length > 0);
    // Make sure image description exists
    require(bytes(_description).length > 0); 
    // Make sure uploader address exists

    require(candidatesCount == imageCount+1);
    // Increment image id
    ++imageCount;
    //require(imageCount == candidatesCount);
    // Add Image to the contract
    images[imageCount] = Image(_id, _imgHash, _description);
    // Trigger an event
    emit ImageCreated(imageCount, _imgHash, _description);
  }
}