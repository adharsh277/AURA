// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract TreasuryVault {
    address public agent;
    IERC20 public usdt;

    bool public safeMode;
    uint256 public maxDrawdown = 10; // percent

    event Rebalanced(uint256 reserve, uint256 hedge, uint256 yield);
    event SafeModeActivated();
    event SafeModeDeactivated();

    constructor(address _usdt, address _agent) {
        usdt = IERC20(_usdt);
        agent = _agent;
    }

    modifier onlyAgent() {
        require(msg.sender == agent, "Not authorized");
        _;
    }

    function activateSafeMode() external onlyAgent {
        safeMode = true;
        emit SafeModeActivated();
    }

    function deactivateSafeMode() external onlyAgent {
        safeMode = false;
        emit SafeModeDeactivated();
    }

    function rebalance(
        address reserveWallet,
        address hedgeWallet,
        address yieldWallet,
        uint256 reserveAmount,
        uint256 hedgeAmount,
        uint256 yieldAmount
    ) external onlyAgent {

        if (safeMode) {
            require(yieldAmount == 0, "Yield disabled in SAFE mode");
        }

        usdt.transfer(reserveWallet, reserveAmount);
        usdt.transfer(hedgeWallet, hedgeAmount);
        usdt.transfer(yieldWallet, yieldAmount);

        emit Rebalanced(reserveAmount, hedgeAmount, yieldAmount);
    }
}
