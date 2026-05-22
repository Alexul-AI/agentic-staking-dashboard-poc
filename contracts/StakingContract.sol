// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract StakingContract is ReentrancyGuard, Ownable {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastUpdate;

    uint256 public totalStaked;

    // 1 = 1% per day
    uint256 public rewardRatePercentPerDay = 1;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardsFunded(address indexed funder, uint256 amount);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);

    constructor() Ownable(msg.sender) {}

    function stake() public payable nonReentrant {
        require(msg.value > 0, "Stake amount must be greater than zero");

        updateReward(msg.sender);

        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    function withdraw() public nonReentrant {
        updateReward(msg.sender);

        uint256 amount = stakes[msg.sender];
        require(amount > 0, "No funds to withdraw");

        stakes[msg.sender] = 0;
        totalStaked -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    function claimReward() public nonReentrant {
        updateReward(msg.sender);

        uint256 reward = rewards[msg.sender];
        require(reward > 0, "No rewards available");
        require(
            address(this).balance >= reward,
            "Contract has insufficient reward funds"
        );

        rewards[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "ETH transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }

    function updateReward(address user) internal {
        if (lastUpdate[user] == 0) {
            lastUpdate[user] = block.timestamp;
            return;
        }

        uint256 timeElapsed = block.timestamp - lastUpdate[user];

        if (stakes[user] > 0 && timeElapsed > 0) {
            uint256 reward = (stakes[user] *
                rewardRatePercentPerDay *
                timeElapsed) / 100 / 1 days;

            rewards[user] += reward;
        }

        lastUpdate[user] = block.timestamp;
    }

    function fundRewards() public payable nonReentrant {
        require(msg.value > 0, "Funding amount must be greater than zero");

        emit RewardsFunded(msg.sender, msg.value);
    }

    function setRewardRate(
        uint256 newRewardRatePercentPerDay
    ) public onlyOwner {
        require(newRewardRatePercentPerDay <= 10, "Reward rate too high");

        uint256 oldRate = rewardRatePercentPerDay;
        rewardRatePercentPerDay = newRewardRatePercentPerDay;

        emit RewardRateUpdated(oldRate, newRewardRatePercentPerDay);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}