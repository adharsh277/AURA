// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AURAPortfolioManager
 * @notice Smart contract for AI-powered portfolio management on Hedera
 * @dev Manages staking, swaps, and portfolio rebalancing
 */
contract AURAPortfolioManager {
    
    // ============ State Variables ============
    
    address public owner;
    address public aiAgent;
    bool public isAgentActive;
    
    // Portfolio tracking
    struct Portfolio {
        uint256 totalValue;
        uint256 riskScore;
        uint256 lastRebalance;
        bool isProtected;
    }
    
    // User portfolios
    mapping(address => Portfolio) public portfolios;
    
    // AI decisions
    struct Decision {
        bytes32 id;
        address user;
        string action;
        uint256 amount;
        uint256 timestamp;
        bool executed;
    }
    
    Decision[] public decisions;
    mapping(bytes32 => uint256) public decisionIndex;
    
    // Risk thresholds
    uint256 public maxRiskThreshold = 70;
    uint256 public stopLossPercentage = 10;
    
    // ============ Events ============
    
    event AgentStatusChanged(bool isActive);
    event DecisionCreated(bytes32 indexed id, address indexed user, string action);
    event DecisionExecuted(bytes32 indexed id, bool success);
    event PortfolioRebalanced(address indexed user, uint256 newValue);
    event StopLossTriggered(address indexed user, uint256 amount);
    event Staked(address indexed user, uint256 amount, address pool);
    event Swapped(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyAgent() {
        require(msg.sender == aiAgent || msg.sender == owner, "Only AI agent");
        _;
    }
    
    modifier agentActive() {
        require(isAgentActive, "Agent is not active");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(address _aiAgent) {
        owner = msg.sender;
        aiAgent = _aiAgent;
        isAgentActive = true;
    }
    
    // ============ Agent Functions ============
    
    /**
     * @notice Start the AI agent
     */
    function startAgent() external onlyOwner {
        isAgentActive = true;
        emit AgentStatusChanged(true);
    }
    
    /**
     * @notice Stop the AI agent
     */
    function stopAgent() external onlyOwner {
        isAgentActive = false;
        emit AgentStatusChanged(false);
    }
    
    /**
     * @notice Update the AI agent address
     */
    function setAgentAddress(address _newAgent) external onlyOwner {
        aiAgent = _newAgent;
    }
    
    // ============ Portfolio Functions ============
    
    /**
     * @notice Initialize user portfolio
     */
    function initializePortfolio() external {
        require(portfolios[msg.sender].totalValue == 0, "Portfolio already exists");
        
        portfolios[msg.sender] = Portfolio({
            totalValue: 0,
            riskScore: 50,
            lastRebalance: block.timestamp,
            isProtected: false
        });
    }
    
    /**
     * @notice Update portfolio value (called by AI agent)
     */
    function updatePortfolioValue(address _user, uint256 _newValue) external onlyAgent {
        portfolios[_user].totalValue = _newValue;
    }
    
    /**
     * @notice Enable portfolio protection (stop-loss)
     */
    function enableProtection() external {
        portfolios[msg.sender].isProtected = true;
    }
    
    /**
     * @notice Disable portfolio protection
     */
    function disableProtection() external {
        portfolios[msg.sender].isProtected = false;
    }
    
    // ============ AI Decision Functions ============
    
    /**
     * @notice Create a new AI decision
     */
    function createDecision(
        address _user,
        string calldata _action,
        uint256 _amount
    ) external onlyAgent agentActive returns (bytes32) {
        bytes32 decisionId = keccak256(abi.encodePacked(_user, _action, block.timestamp));
        
        decisions.push(Decision({
            id: decisionId,
            user: _user,
            action: _action,
            amount: _amount,
            timestamp: block.timestamp,
            executed: false
        }));
        
        decisionIndex[decisionId] = decisions.length - 1;
        
        emit DecisionCreated(decisionId, _user, _action);
        return decisionId;
    }
    
    /**
     * @notice Execute a pending decision
     */
    function executeDecision(bytes32 _decisionId) external onlyAgent agentActive {
        uint256 index = decisionIndex[_decisionId];
        Decision storage decision = decisions[index];
        
        require(!decision.executed, "Decision already executed");
        
        // Execute the decision (actual logic would depend on action type)
        decision.executed = true;
        
        // Update portfolio
        portfolios[decision.user].lastRebalance = block.timestamp;
        
        emit DecisionExecuted(_decisionId, true);
    }
    
    // ============ Staking Functions ============
    
    /**
     * @notice Stake tokens (AI-initiated or user-initiated)
     */
    function stake(address _pool, uint256 _amount) external agentActive {
        require(_amount > 0, "Amount must be > 0");
        
        // In production, integrate with actual staking protocols
        // This is a placeholder for the staking logic
        
        emit Staked(msg.sender, _amount, _pool);
    }
    
    /**
     * @notice AI-initiated stake for user
     */
    function executeStake(
        address _user,
        address _pool,
        uint256 _amount
    ) external onlyAgent agentActive {
        require(_amount > 0, "Amount must be > 0");
        
        // Execute staking on behalf of user
        // Requires prior user approval
        
        emit Staked(_user, _amount, _pool);
    }
    
    // ============ Swap Functions ============
    
    /**
     * @notice Execute token swap (AI-initiated)
     */
    function executeSwap(
        address _user,
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _minAmountOut
    ) external onlyAgent agentActive returns (uint256) {
        require(_amountIn > 0, "Amount must be > 0");
        
        // In production, integrate with DEX (SaucerSwap)
        // This is a placeholder
        uint256 amountOut = _amountIn; // Mock 1:1 swap
        
        emit Swapped(_user, _tokenIn, _tokenOut, _amountIn, amountOut);
        return amountOut;
    }
    
    // ============ Risk Management ============
    
    /**
     * @notice Update risk thresholds
     */
    function setRiskThreshold(uint256 _newThreshold) external onlyOwner {
        require(_newThreshold <= 100, "Invalid threshold");
        maxRiskThreshold = _newThreshold;
    }
    
    /**
     * @notice Update stop-loss percentage
     */
    function setStopLoss(uint256 _percentage) external onlyOwner {
        require(_percentage <= 50, "Max 50%");
        stopLossPercentage = _percentage;
    }
    
    /**
     * @notice Trigger stop-loss for user
     */
    function triggerStopLoss(address _user) external onlyAgent {
        Portfolio storage portfolio = portfolios[_user];
        require(portfolio.isProtected, "Protection not enabled");
        
        // Execute stop-loss logic
        // Sell volatile assets, convert to stablecoins
        
        emit StopLossTriggered(_user, portfolio.totalValue);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get portfolio details
     */
    function getPortfolio(address _user) external view returns (
        uint256 totalValue,
        uint256 riskScore,
        uint256 lastRebalance,
        bool isProtected
    ) {
        Portfolio memory p = portfolios[_user];
        return (p.totalValue, p.riskScore, p.lastRebalance, p.isProtected);
    }
    
    /**
     * @notice Get total number of decisions
     */
    function getDecisionCount() external view returns (uint256) {
        return decisions.length;
    }
    
    /**
     * @notice Get decision by index
     */
    function getDecision(uint256 _index) external view returns (
        bytes32 id,
        address user,
        string memory action,
        uint256 amount,
        uint256 timestamp,
        bool executed
    ) {
        Decision memory d = decisions[_index];
        return (d.id, d.user, d.action, d.amount, d.timestamp, d.executed);
    }
    
    /**
     * @notice Check if agent is active
     */
    function getAgentStatus() external view returns (bool) {
        return isAgentActive;
    }
}
