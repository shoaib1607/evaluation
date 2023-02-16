async function Transfer(contract, address, amount){
    try {
        const receipt = contract.transfer(address,amount);
        console.log(receipt)
    } catch (error) {
        return error
    } 
}

Transfer();