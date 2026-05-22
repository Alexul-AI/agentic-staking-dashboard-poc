import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { parseEther, toEventSelector } from "viem";

describe("StakingContract", async () => {
  const { viem, networkHelpers } = await network.connect();

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

  const hasEvent = (
    receipt: { logs: Array<{ address?: string; topics?: readonly string[] }> },
    contractAddress: string,
    eventSignature: string,
  ) => {
    const eventTopic = toEventSelector(eventSignature);

    return receipt.logs.some((log) => {
      return (
        log.address?.toLowerCase() === contractAddress.toLowerCase() &&
        log.topics?.[0] === eventTopic
      );
    });
  };

  it("deploys with the deployer as owner", async () => {
    const { staking, owner } = await deployFixture();

    const contractOwner = (await staking.read.owner()) as string;

    assert.equal(
      contractOwner.toLowerCase(),
      owner.account.address.toLowerCase(),
    );
  });

  it("allows a user to stake ETH and emits Staked", async () => {
    const { staking, publicClient, user } = await deployFixture();

    const stakeAmount = parseEther("0.001");

    const hash = await staking.write.stake([], {
      account: user.account,
      value: stakeAmount,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    assert.equal(receipt.status, "success");

    assert.equal(
      hasEvent(receipt, staking.address, "Staked(address,uint256)"),
      true,
    );

    const userStake = (await staking.read.stakes([
      user.account.address,
    ])) as bigint;

    const totalStaked = (await staking.read.totalStaked()) as bigint;

    assert.equal(userStake, stakeAmount);
    assert.equal(totalStaked, stakeAmount);
  });

  it("allows reward pool funding, updates contract balance, and emits RewardsFunded", async () => {
    const { staking, publicClient, user } = await deployFixture();

    const fundingAmount = parseEther("0.002");

    const hash = await staking.write.fundRewards([], {
      account: user.account,
      value: fundingAmount,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    assert.equal(receipt.status, "success");

    assert.equal(
      hasEvent(receipt, staking.address, "RewardsFunded(address,uint256)"),
      true,
    );

    const contractBalance = (await staking.read.getContractBalance()) as bigint;

    assert.equal(contractBalance, fundingAmount);
  });

  it("allows a staker to withdraw staked ETH and emits Withdrawn", async () => {
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

    assert.equal(
      hasEvent(receipt, staking.address, "Withdrawn(address,uint256)"),
      true,
    );

    const userStake = (await staking.read.stakes([
      user.account.address,
    ])) as bigint;

    const totalStaked = (await staking.read.totalStaked()) as bigint;

    assert.equal(userStake, 0n);
    assert.equal(totalStaked, 0n);
  });

  it("allows a user to claim rewards when reward pool has enough liquidity and emits RewardClaimed", async () => {
    const { staking, publicClient, user } = await deployFixture();

    const stakeAmount = parseEther("1");
    const rewardPoolAmount = parseEther("1");

    await staking.write.fundRewards([], {
      account: user.account,
      value: rewardPoolAmount,
    });

    await staking.write.stake([], {
      account: user.account,
      value: stakeAmount,
    });

    await networkHelpers.time.increase(24 * 60 * 60);

    const hash = await staking.write.claimReward([], {
      account: user.account,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    assert.equal(receipt.status, "success");

    assert.equal(
      hasEvent(receipt, staking.address, "RewardClaimed(address,uint256)"),
      true,
    );

    const rewardsAfterClaim = (await staking.read.rewards([
      user.account.address,
    ])) as bigint;

    assert.equal(rewardsAfterClaim, 0n);
  });

  it("rejects reward claim when contract reward pool is insufficient", async () => {
    const { staking, user } = await deployFixture();

    await staking.write.setRewardRate([10n]);

    await staking.write.stake([], {
      account: user.account,
      value: parseEther("0.001"),
    });

    await networkHelpers.time.increase(11 * 24 * 60 * 60);

    await assert.rejects(async () => {
      await staking.write.claimReward([], {
        account: user.account,
      });
    });
  });

  it("prevents non-owner from changing reward rate", async () => {
    const { staking, user } = await deployFixture();

    await assert.rejects(async () => {
      await staking.write.setRewardRate([2n], {
        account: user.account,
      });
    });
  });

  it("allows owner to change reward rate and emits RewardRateUpdated", async () => {
    const { staking, publicClient, owner } = await deployFixture();

    const hash = await staking.write.setRewardRate([2n], {
      account: owner.account,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    assert.equal(receipt.status, "success");

    assert.equal(
      hasEvent(receipt, staking.address, "RewardRateUpdated(uint256,uint256)"),
      true,
    );

    const rewardRate = (await staking.read.rewardRatePercentPerDay()) as bigint;

    assert.equal(rewardRate, 2n);
  });

  it("rejects reward rate above maximum", async () => {
    const { staking, owner } = await deployFixture();

    await assert.rejects(async () => {
      await staking.write.setRewardRate([11n], {
        account: owner.account,
      });
    });
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

  it("rejects withdraw when user has no staked funds", async () => {
    const { staking, user } = await deployFixture();

    await assert.rejects(async () => {
      await staking.write.withdraw([], {
        account: user.account,
      });
    });
  });

  it("tracks multiple user stakes independently", async () => {
    const { staking, user, otherUser } = await deployFixture();

    const userStakeAmount = parseEther("0.001");
    const otherUserStakeAmount = parseEther("0.002");

    await staking.write.stake([], {
      account: user.account,
      value: userStakeAmount,
    });

    await staking.write.stake([], {
      account: otherUser.account,
      value: otherUserStakeAmount,
    });

    const userStake = (await staking.read.stakes([
      user.account.address,
    ])) as bigint;

    const otherUserStake = (await staking.read.stakes([
      otherUser.account.address,
    ])) as bigint;

    const totalStaked = (await staking.read.totalStaked()) as bigint;

    assert.equal(userStake, userStakeAmount);
    assert.equal(otherUserStake, otherUserStakeAmount);
    assert.equal(totalStaked, userStakeAmount + otherUserStakeAmount);
  });
});
