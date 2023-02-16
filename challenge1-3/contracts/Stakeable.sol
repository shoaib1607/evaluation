//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Stakeable is ERC20, Ownable{
    /**
    * @notice Constructor since this contract is not ment to be used without inheritance
    * push once to stakeholders for it to work proplerly
     */
     uint8 _decimals;
    constructor(address _owner, uint256 totalSupply_, uint8 decimals_) ERC20("MYToken", "MT"){
        // This push is needed so we avoid index 0 causing bug of index-1
        stakeholders.push();
        _transferOwnership(_owner);
        _decimals = decimals_;
        totalSupply_ = totalSupply_ * (10**uint256(_decimals)); //1000000000
        _mint(_owner, totalSupply_);
    }
       

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }


    /**
     * @notice
     * A stake struct is used to represent the way we store stakes, 
     * A Stake will contain the users address, the amount staked and a timestamp, 
     * Since which is when the stake was made
     */
    struct Stake{
            address user;
            uint256 amount;
            uint256 since;
        }
    /**
    * @notice 
    * stakes is used to keep track of the INDEX for the stakers in the stakes array
    *
     */
    mapping(address => uint256) public stakes;

    /**
    * @notice Stakeholder is a staker that has active stakes
     */
    struct Stakeholder{
            address user;
            Stake[] address_stakes;
    }
    /**
    * @notice 
    *   This is a array where we store all Stakes that are performed on the Contract
    *   The stakes for each address are stored at a certain index, the index can be found using the stakes mapping
    */
    Stakeholder[] public stakeholders;

    //rewards based on address
    mapping(address => uint256) private rewards;

    /**
    * @notice Staked event is triggered whenever a user stakes tokens, address is indexed to make it filterable
    */
     event Staked(address indexed user, uint256 amount, uint256 index, uint256 timestamp);

    //add stakeholder
    function _addStakeholder(address staker) private returns (uint256){
        // Push a empty item to the Array to make space for our new stakeholder
        stakeholders.push();
        // Calculate the index of the last item in the array by Len-1
        uint256 userIndex = stakeholders.length - 1;
        // Assign the address to the new index
        stakeholders[userIndex].user = staker;
        // Add index to the stakeHolders
        stakes[staker] = userIndex;
        return userIndex; 
    }

       /**
    * Add functionality like burn to the _stake afunction
    *
     */
    function stake(uint256 _amount) public {
      // Make sure staker actually is good for it
      require(_amount < balanceOf(msg.sender), "DevToken: Cannot stake more than you own");

        _stake(_amount);
                // Burn the amount of tokens on the sender
        _burn(msg.sender, _amount);
    }

    /**
    * @notice
    * _Stake is used to make a stake for an sender. It will remove the amount staked from the stakers account and place those tokens inside a stake container
    * StakeID 
    */
    function _stake(uint256 _amount) private{
        // Simple check so that user does not stake 0 
        require(_amount > 0, "Cannot stake nothing");
    
        uint256 index = stakes[msg.sender];
        // block.timestamp = timestamp of the current block in seconds since the epoch
        uint256 timestamp = block.timestamp;
        // See if the staker already has a staked index or if its the first time
        if(index == 0){
            // This stakeholder stakes for the first time
            // We need to add him to the stakeHolders and also map it into the Index of the stakes
            // The index returned will be the index of the stakeholder in the stakeholders array
            index = _addStakeholder(msg.sender);
        }

        // Use the index to push a new Stake
        // push a newly created Stake with the current block timestamp.
        stakeholders[index].address_stakes.push(Stake(msg.sender, _amount, timestamp));
        // Emit an event that the stake has occured
        emit Staked(msg.sender, _amount, index, timestamp);
    }

     /**
    * @notice withdrawStake is used to withdraw stakes from the account holder
     */
    function unstake(uint256 amount, uint256 stake_index)  public {

      uint256 amount_to_mint = _unstake(amount, stake_index);
      // Return staked tokens to user
      _mint(msg.sender, amount_to_mint);
    }

    /**
     * @notice
     * _unstake takes in an amount and a index of the stake and will remove tokens from that stake
     * Notice index of the stake is the users stake counter, starting at 0 for the first stake
     * suppose user stake for first time it is zero for second time it is one like that
     * Will return the amount to MINT onto the acount
     * Will also calculateStakeReward and reset timer
    */
     function _unstake(uint256 amount, uint256 index) private returns(uint256){
         // Grab user_index which is the index to use to grab the Stake[]
        uint256 user_index = stakes[msg.sender];
        Stake memory current_stake = stakeholders[user_index].address_stakes[index];
        require(current_stake.amount >= amount, "Staking: Cannot withdraw more than you have staked");

         // Calculate available Reward first before we start modifying data
         bool reward = calculateStakeReward(current_stake, msg.sender);
         require(reward,"Error while calculating reward");
         // Remove by subtracting the money unstaked 
         current_stake.amount = current_stake.amount - amount;
         // If stake is empty, 0, then remove it from the array of stakes
         if(current_stake.amount == 0){
             delete stakeholders[user_index].address_stakes[index];
         }else {
             // If not empty then replace the value of it
             stakeholders[user_index].address_stakes[index].amount = current_stake.amount;
             // Reset timer of stake
            stakeholders[user_index].address_stakes[index].since = block.timestamp;    
         }

         return amount;
     }

    /**
      * @notice
      * calculateStakeReward is used to calculate how much a user should be rewarded for their stakes
      * and the duration the stake has been active
     */
      function calculateStakeReward(Stake memory _current_stake, address address_) private returns(bool){
          
          uint stakedtime = block.timestamp - _current_stake.since;
          if(stakedtime > 300 && stakedtime < 600)
          {
             rewards[address_] = 5;
          }else if(stakedtime > 600)
          {
            rewards[address_] = 10;
          }
          return true;
      }


      function rewardOf(address _stakeholder)
       public
       view
       returns(uint256)
   {
       return rewards[_stakeholder];
   }

    /**
    * @notice A method to allow a stakeholder to withdraw his rewards.
    */
   function withdrawReward()
       public
   {
       uint256 reward = rewards[msg.sender];
       rewards[msg.sender] = 0;
       _mint(msg.sender, reward);
   }
}


