// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title BharatVote
 * @dev A simple smart contract for a voting application.
 * It allows for creating an election with a set of candidates.
 * Each address is allowed to vote only once.
 */
contract BharatVote {
    // State variable to store the name of the election.
    string public electionName;

    // A structure to represent a candidate.
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    // An array to store all candidates.
    Candidate[] public candidates;

    // A mapping to keep track of which addresses have already voted.
    // address => boolean (true if voted, false otherwise).
    mapping(address => bool) public voters;

    /**
     * @dev The constructor initializes the smart contract with the election name
     * and a list of candidate names.
     * @param _electionName The name of the election.
     * @param _candidateNames An array of strings representing the names of the candidates.
     */
    constructor(string memory _electionName, string[] memory _candidateNames) {
        electionName = _electionName;
        // Loop through the provided candidate names and add them to the candidates array.
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({
                name: _candidateNames[i],
                voteCount: 0
            }));
        }
    }

    /**
     * @dev Allows a user to vote for a candidate.
     * The function requires that the voter has not voted before and the candidate index is valid.
     * @param _candidateIndex The index of the candidate to vote for in the `candidates` array.
     */
    function vote(uint256 _candidateIndex) public {
        // Check if the voter has already voted.
        require(!voters[msg.sender], "You have already voted.");
        // Check if the candidate index is valid.
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        // Mark the sender as having voted.
        voters[msg.sender] = true;
        // Increment the vote count for the chosen candidate.
        candidates[_candidateIndex].voteCount++;
    }

    /**
     * @dev Retrieves the list of all candidates along with their vote counts.
     * @return An array of Candidate structs.
     */
    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}
