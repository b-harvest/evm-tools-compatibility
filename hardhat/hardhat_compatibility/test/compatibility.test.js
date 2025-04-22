// test/HardhatBasics.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hardhat Local Chain Compatibility Test", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;

  before(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a simple ERC20 token
    const TokenFactory = await ethers.getContractFactory("TokenExample");
    token = await TokenFactory.deploy();
    await token.waitForDeployment();
    Token = token;
  });

  it("Should deploy the contract correctly", async function () {
    expect(await Token.name()).to.equal("Example");
    expect(await Token.symbol()).to.equal("EXP");
  });

  it("Should mint initial supply to deployer", async function () {
    const totalSupply = await Token.totalSupply();
    const balance = await Token.balanceOf(owner.address);
    expect(balance).to.equal(totalSupply);
  });

  it("Should allow transfers between accounts", async function () {
    await Token.mint(owner.address,'1'+'0'.repeat(20));
    await Token.transfer(addr1.address, 1000);
    expect(await Token.balanceOf(addr1.address)).to.equal(1000);
  });

  it("Should fail if sender doesn’t have enough balance", async function () {
    await expect(Token.connect(addr1).transfer(addr2.address, 999999)).to.be.revertedWithCustomError(Token, "ERC20InsufficientBalance");
  });

  it("Should update balances after transfers", async function () {
    await Token.mint(owner.address,'1'+'0'.repeat(20));
    await Token.transfer(addr2.address, 500);
    const balance2 = await Token.balanceOf(addr2.address);
    expect(balance2).to.equal(500);
  });
});
