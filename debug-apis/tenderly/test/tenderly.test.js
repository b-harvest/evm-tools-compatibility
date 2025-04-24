const fetch = require('node-fetch');
const { expect } = require('chai');
require('dotenv').config();

describe("Tenderly REST API Simulation Tests", function () {
  const accessKey = process.env.TENDERLY_ACCESS_KEY;
  const account = process.env.TENDERLY_ACCOUNT;
  const project = process.env.TENDERLY_PROJECT;

  it("Should simulate empty transaction on Mainnet successfully", async function () {
    const payload = {
      network_id: "1",  // Ethereum Mainnet
      from: "0x0000000000000000000000000000000000000000",
      to: null,
      input: "0x",  // Empty tx
      save_if_fails: true,
      save: true,
    };

    const response = await fetch(`https://api.tenderly.co/api/v1/account/${account}/project/${project}/simulate`, {
      method: 'POST',
      headers: {
        'X-Access-Key': accessKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    expect(result.simulation).to.exist;
    expect(result.simulation.status).to.be.true;
  });

  it("Should fail simulation on local chainId (262144)", async function () {
    const payload = {
      network_id: "262144",  // Local Chain
      from: "0x0000000000000000000000000000000000000000",
      to: null,
      input: "0x",  // Empty tx
      save_if_fails: true,
      save: true,
    };

    const response = await fetch(`https://api.tenderly.co/api/v1/account/${account}/project/${project}/simulate`, {
      method: 'POST',
      headers: {
        'X-Access-Key': accessKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    expect(result.error).to.exist;
    expect(result.error.slug).to.equal("internal_server_error");
  });
});
