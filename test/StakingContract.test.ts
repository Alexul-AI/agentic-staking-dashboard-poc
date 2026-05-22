import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { parseEther } from "viem";

describe("StakingContract", async () => {
  const { viem } = await network.connect();

  const deployFixture = async () => {
    const publicClient = await viem.getPublicClient();
    const [owner, user, otherUser] = await viem.getWalletClients();

    const staking = await viem.deployContract("StakingContract");

    return {
      staking,
      publicClient,
      owner,
      user,
      otherUser,
    };
  };

  it("deploys with the deployer as owner", async () => {
    const { staking, owner } = await deployFixture();

    const contractOwner = (await staking.read.owner()) as string;

    assert.equal(
      contractOwner.toLowerCase(),
      owner.account.address.toLowerCase(),
    );
  });

  it("allows a user to stake ETH", async () => {
    const { staking, publicClient, user } = await deployFixture();

    const stakeAmount = parseEther("0.001");

    const hash = await staking.write.stake([], {
      account: user.account,
      value: stakeAmount,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    assert.equal(receipt.status, "success");

    const userStake = (await staking.read.stakes([
      user.account.address,
    ])) as bigint;

    const totalStaked = (await staking.read.totalStaked()) as bigint;

    assert.equal(userStake, stakeAmount);
    assert.equal(totalStaked, stakeAmount);
  });

  it("allows reward pool funding and updates contract balance", async () => {
    const { staking, publicClient, user } = await deployFixture();

    const fundingAmount = parseEther("0.002");

    const hash = await staking.write.fundRewards([], {
      account: user.account,
      value: fundingAmount,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    assert.equal(receipt.status, "success");

    const contractBalance = (await staking.read.getContractBalance()) as bigint;

    assert.equal(contractBalance, fundingAmount);
  });

  it("allows a staker to withdraw staked ETH", async () => {
    const { staking, publicClient, user } = await deployFixture();

    const stakeAmount = parseEther("0.001");

    await staking.write.stake([], {
      account: user.account,
      value: stakeAmount,
    });

    const hash = await staking.write.withdraw([], {
      account: user.account,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    assert.equal(receipt.status, "success");

    const userStake = (await staking.read.stakes([
      user.account.address,
    ])) as bigint;

    const totalStaked = (await staking.read.totalStaked()) as bigint;

    assert.equal(userStake, 0n);
    assert.equal(totalStaked, 0n);
  });

  it("prevents non-owner from changing reward rate", async () => {
    const { staking, user } = await deployFixture();

    await assert.rejects(async () => {
      await staking.write.setRewardRate([2n], {
        account: user.account,
      });
    });
  });

  it("allows owner to change reward rate", async () => {
    const { staking, owner } = await deployFixture();

    await staking.write.setRewardRate([2n], {
      account: owner.account,
    });

    const rewardRate = (await staking.read.rewardRatePercentPerDay()) as bigint;

    assert.equal(rewardRate, 2n);
  });

  it("rejects zero-value stake", async () => {
    const { staking, user } = await deployFixture();

    await assert.rejects(async () => {
      await staking.write.stake([], {
        account: user.account,
        value: 0n,
      });
    });
  });

  it("rejects zero-value reward funding", async () => {
    const { staking, user } = await deployFixture();

    await assert.rejects(async () => {
      await staking.write.fundRewards([], {
        account: user.account,
        value: 0n,
      });
    });
  });
});
