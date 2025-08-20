const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BharatVote", function () {
  let contractInstance;
  let owner, addr1, addr2;
  const electionName = "Lok Sabha Election 2024";
  const candidateNames = ["Candidate A", "Candidate B", "Candidate C"];

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const BharatVote = await ethers.getContractFactory("BharatVote");
    contractInstance = await BharatVote.deploy(electionName, candidateNames);
  });

  it("Should deploy and set the election name and candidates correctly", async function () {
    expect(await contractInstance.electionName()).to.equal(electionName);
    const candidates = await contractInstance.getAllCandidates();
    expect(candidates.length).to.equal(3);
    expect(candidates[0].name).to.equal("Candidate A");
  });

  it("Should allow a user to vote and update vote count", async function () {
    await contractInstance.connect(addr1).vote(1);
    const candidates = await contractInstance.getAllCandidates();
    expect(candidates[1].voteCount).to.equal(1);
    expect(await contractInstance.voters(addr1.address)).to.be.true;
  });

  it("Should prevent a user from voting more than once", async function () {
    await contractInstance.connect(addr1).vote(0);
    await expect(
      contractInstance.connect(addr1).vote(1)
    ).to.be.revertedWith("You have already voted.");
  });

  it("Should fail if voting for an invalid candidate", async function () {
    await expect(
      contractInstance.connect(addr2).vote(99)
    ).to.be.revertedWith("Invalid candidate index.");
  });

  it("Should correctly count votes from multiple users", async function () {
    await contractInstance.connect(addr1).vote(1);
    await contractInstance.connect(addr2).vote(1);
    await contractInstance.connect(owner).vote(0);

    const candidates = await contractInstance.getAllCandidates();
    expect(candidates[0].voteCount).to.equal(1);
    expect(candidates[1].voteCount).to.equal(2);
    expect(candidates[2].voteCount).to.equal(0);
  });
});