pragma solidity 0.5.16;

import './Election.sol';

contract Authentication{
    string public username;
    string public password;
    uint public id;
    Election public election;
    Voter public voters;

    mapping(string => address payable) public uintAddress;
    mapping(string => address payable) public stringAddress;

    constructor() public {
        username = '';
        password = ''; 
        id = 0;
        
    }

    function authenticate(string memory _username, string memory _password) public {

    }

}