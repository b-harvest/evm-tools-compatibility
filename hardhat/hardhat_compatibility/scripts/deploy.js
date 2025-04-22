const { ethers } = require("hardhat");

let deployedAddr;

async function deploy(){
    const [deployer, s1, s2, s3, s4, s5] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
  
    // 1. contract 배포
    const Contract = await ethers.getContractFactory("TokenExample");
    const exampleToken=await Contract.deploy();

    await exampleToken.waitForDeployment();
    const addr = await exampleToken.getAddress();
    deployedAddr = addr;

    console.log(addr);
    await exampleToken.mint(await deployer.getAddress(),'1'+'0'.repeat(6));
    console.log("mint");
    await exampleToken.connect(deployer).transfer(await s1.getAddress(),'1'+'0'.repeat(6));
    console.log("transferred");

}

async function main(){
    await deploy();
}

main();