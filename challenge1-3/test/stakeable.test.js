const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { tokenFixture } = require("./helpers");
const BN = ethers.BigNumber.from;
const {
    NAME,
    SYMBOL,
    TOTAL_SUPPLY,
    DECIMALS,
    ZERO_ADDRESS
  } = require("./config");

describe("Stakeable Deployment", () => {
    const TOTAL_SUPPLY_BN = BN(TOTAL_SUPPLY);
    const DECIMAL_BN = BN(DECIMALS);
    const TOTAL_SUPPLY_BN_WEI = TOTAL_SUPPLY_BN.mul(BN(10).pow(DECIMAL_BN));

    it('Ownership transferred from deployer to owner', async () => {
        const { stakeable, owner } = await loadFixture(tokenFixture);
        const result = await stakeable.owner();
        expect(result).to.equal(owner.address);
      });
  
    describe('Metadata', () => {
      it('Token metadata is correct', async () => {
        const { stakeable, owner } = await loadFixture(tokenFixture);
        expect(await stakeable.name()).to.equal(NAME);
        expect(await stakeable.symbol()).to.equal(SYMBOL);
        expect((await stakeable.totalSupply()).eq(TOTAL_SUPPLY)).is.true;
      });
    });

    describe('Balance', () => {
        it('Users can check their balance', async () => {
          const { stakeable, user1 } = await loadFixture(tokenFixture);
          expect((await stakeable.balanceOf(user1.address)).eq(BN(0))).is.true;
          await stakeable.transfer(user1.address, 10);
          expect((await stakeable.balanceOf(user1.address)).eq(10)).is.true;
        });
      });
    
      describe('Transfer', () => {
        it('Initial supply minted and transferred to owner', async () => {
          const { stakeable,owner } = await loadFixture(tokenFixture);
          expect((await stakeable.balanceOf(owner.address)).eq(TOTAL_SUPPLY)).is.true;
        });
    
        it('Users can transfer tokens to other users', async () => {
          const { stakeable,user1,user2 } = await loadFixture(tokenFixture);
          //admin to user1.address
          await stakeable.transfer(user1.address, 10);
          expect((await stakeable.balanceOf(user1.address)).eq(10)).is.true;
          //user1.address to user2.address
          await stakeable.connect(user1).transfer(user2.address, 10);
          expect((await stakeable.balanceOf(user2.address)).eq(10)).is.true;
        });
    
        it('Event emitted when tokens are transferred', async () => {
          const { stakeable,owner ,user1 } = await loadFixture(tokenFixture);
          await expect(stakeable.transfer(user1.address, 10))
            .to.emit(stakeable, 'Transfer')
            .withArgs(owner.address, user1.address, 10);
        });
    
        it('Reverts if user tries to transfer tokens without enough balance', async () => {
          const { stakeable,user1, user2 } = await loadFixture(tokenFixture);
          await expect(
            stakeable.connect(user1).transfer(user2.address, 10)
          ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
        });
    
        it('Reverts if user tries to transfer tokens to zero address', async () => {
         const { stakeable,user1,  } = await loadFixture(tokenFixture);
          await expect(
            stakeable.connect(user1).transfer(ZERO_ADDRESS, 10)
          ).to.be.revertedWith('ERC20: transfer to the zero address');
        });
      });
    
      describe('Allowance', () => {
        it('Users can check their allowance', async () => {
          const { stakeable,owner,user1,  } = await loadFixture(tokenFixture);
          expect((await stakeable.allowance(owner.address, user1.address)).eq(BN(0)));
          //approving allowance
          await stakeable.approve(user1.address, 10);
          //checking allowance
          expect((await stakeable.allowance(owner.address, user1.address)).eq(10));
        });
    
        it('Approve transfer of available tokens by third-party', async () => {
          const { stakeable,owner,user1,user2 } = await loadFixture(tokenFixture);
          const balanceOfOwner = await stakeable.balanceOf(owner.address);
          const balanceOfUser1 = await stakeable.balanceOf(user1.address);
          const balanceOfUser2 = await stakeable.balanceOf(user2.address);
          //approving allowance
          await stakeable.approve(user1.address, 10);
          //checking allowance
          expect((await stakeable.allowance(owner.address, user1.address)).eq(10));
          //verifying transaction of approved tokens
          await stakeable.connect(user1).transferFrom(owner.address, user2.address, 10);
    
          expect((await stakeable.balanceOf(owner.address)).eq(balanceOfOwner.sub(10)));
    
          expect((await stakeable.balanceOf(user1.address)).eq(balanceOfUser1));
    
          expect((await stakeable.balanceOf(user2.address)).eq(balanceOfUser2.add(10)));
        });
    
        it('Event emitted someone approves transfer of available tokens by third-party', async () => {  
            const { stakeable,owner,user1, } = await loadFixture(tokenFixture);
            await expect(stakeable.approve(user1.address, 10))
            .to.emit(stakeable, 'Approval')
            .withArgs(owner.address, user1.address, 10);
        });
    
        it('Increase allowance', async () => {
            const { stakeable,owner,user1, } = await loadFixture(tokenFixture);
          await stakeable.approve(user1.address, 100);
          expect((await stakeable.allowance(owner.address, user1.address)).eq(100));
          await stakeable.increaseAllowance(user1.address, 50);
          expect(
            (await stakeable.allowance(owner.address, user1.address)).eq(
              150
            )
          );
        });
    
        it('Decrease allowance', async () => {
            const { stakeable,owner,user1, } = await loadFixture(tokenFixture);
          await stakeable.approve(user1.address, 100);
          expect((await stakeable.allowance(owner.address, user1.address)).eq(100));
          await stakeable.increaseAllowance(user1.address, 50);
          expect(
            (await stakeable.allowance(owner.address, user1.address)).eq(
              50
            )
          );
        });
    
        it('Revert when trying to approve unavailable tokens by third-party', async () => {
          const { stakeable,owner,user1,user2 } = await loadFixture(tokenFixture);
          //approving allowance
          await stakeable.connect(user1).approve(user2.address, 100);
          //checking allowance
          expect((await stakeable.allowance(user1.address, user2.address)).eq(100));
          //verifying transaction of approved tokens
          await expect(
            stakeable.connect(user2).transferFrom(user1.address, owner.address, 100)
          ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
        });
    
        it('Revert when trying to transfer more than allowed tokens by third-party', async () => {
            const { stakeable,owner,user1,user2 } = await loadFixture(tokenFixture);
            //approving allowance
          await stakeable.approve(user1.address, 100);
          //checking allowance
          expect((await stakeable.allowance(owner.address, user1.address)).eq(100));
          //verifying transaction of approved tokens
          await expect(
            stakeable
              .connect(user1)
              .transferFrom(owner.address, user2.address, 110)
          ).to.be.revertedWith('ERC20: insufficient allowance');
        });
      });

      describe('Ownership', () => {
        it('Transferring ownership', async () => {
            const { stakeable,owner,user1 } = await loadFixture(tokenFixture);
          await stakeable.transferOwnership(user1.address);
          expect(await stakeable.owner()).to.equal(user1.address);
        });
    
        it('Event emitted on transferring ownership', async () => {
            const { stakeable,owner,user1, } = await loadFixture(tokenFixture);
          await expect(stakeable.transferOwnership(user1.address))
            .to.emit(stakeable, 'OwnershipTransferred')
            .withArgs(owner.address, user1.address);
        });
    
        it('Revert when some user other than owner tries to transfer ownership', async () => {
            const { stakeable,user2,user1, } = await loadFixture(tokenFixture);
          await expect(stakeable.connect(user2).transferOwnership(user1.address)).to.be.revertedWith(
            'Ownable: caller is not the owner'
          );
        });
    
        it('Renounce ownership', async () => {
            const { stakeable,owner, } = await loadFixture(tokenFixture);
          await stakeable.renounceOwnership();
          expect(await stakeable.owner()).to.not.equal(owner.address);
        });
    
        it('Revert when some user other than owner tries to renounce ownership', async () => {
            const { stakeable, user2, } = await loadFixture(tokenFixture);
          await expect(stakeable.connect(user2).renounceOwnership()).to.be.revertedWith(
            'Ownable: caller is not the owner'
          );
        });
      });  
      
      
      describe('Stake', () => {
        it('User can stake their token', async () => {
          const { stakeable,owner,user1 } = await loadFixture(tokenFixture);
          await stakeable.stake(100);
          await stakeable.transfer(user1.address,20);
          //stake present at index 1
          expect(await stakeable.stakes(owner.address)).to.equal(1);
          await stakeable.connect(user1).stake(10);
          //stake present at index 2
          expect(await stakeable.stakes(user1.address)).to.equal(2);
        });
    
        it('Event emited when tokens are stake ', async () => {
            const { stakeable,owner,user1, } = await loadFixture(tokenFixture);
          await expect(await stakeable.stake(10))
            .to.emit(stakeable, 'Staked')
            .withArgs(owner.address, 10 ,await stakeable.stakes(owner.address));
        });
    
        it('Revert when user who does not have token try to stake token', async () => {
            const { stakeable, user2, } = await loadFixture(tokenFixture);
          await expect(stakeable.connect(user2).stake(10)).to.be.revertedWith(
            'Token: Cannot stake more than you own'
          );
        });
        it('Revert when stake token amount is exceeding', async () => {
            const { stakeable, owner } = await loadFixture(tokenFixture);
          await expect(stakeable.stake(10000000000)).to.be.revertedWith(
            'Token: Cannot stake more than you own'
          );
        });  
        
      });   
      
              
});