// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StakingContract {
    mapping(address => uint256) public stakes;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public lastUpdate;

    uint256 public totalStaked;

    // 1 = 1% per day
    uint256 public rewardRatePercentPerDay = 1;

    address public owner;

    bool private locked;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier nonReentrant() {
        require(!locked, "Reentrant call detected");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = msg.sender;
    }

    function stake() public payable nonReentrant {
        require(msg.value > 0, "Stake amount must be greater than zero");

        updateReward(msg.sender);

        stakes[msg.sender] += msg.value;
        totalStaked += msg.value;
    }

    function withdraw() public nonReentrant {
        updateReward(msg.sender);

        uint256 amount = stakes[msg.sender];
        require(amount > 0, "No funds to withdraw");

        stakes[msg.sender] = 0;
        totalStaked -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");
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

    function fundRewards() public payable {
        require(msg.value > 0, "Funding amount must be greater than zero");
    }

    function setRewardRate(uint256 newRewardRatePercentPerDay) public onlyOwner {
        require(newRewardRatePercentPerDay <= 10, "Reward rate too high");

        rewardRatePercentPerDay = newRewardRatePercentPerDay;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}