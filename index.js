const BigNumber = require('bignumber.js');
const ethers = require('ethers')

let dollarPrice1 = 80.0; // price of dollar in first country, can be changed
let dollarPrice2 = 10.0; //price of dollar in second country, can be changed

// Function to perform onramp operation
function onramp(input) {
    if (typeof input === 'number' && !isNaN(input)) {
        let convertedAmount = input / dollarPrice1;
        transfer(convertedAmount);
    } else {
        console.error("Invalid input. Please provide a valid number.");
    }
}

// Function to perform transfer operation
function transfer(amount) {
    let amountBig = new BigNumber(amount);
    let amountToSend = amountBig.times(new BigNumber(10).exponentiatedBy(18));
    console.log("Sending "+amountBig.toFixed()+" USDT")
    //ethersjs call to contract : 0xA9eA7ab695B8040379851b008261948A8B46ffF4, function transfer(to, value)
    //to is the wallet address of the storage wallet (make it your wallet for now). value is amount
    offramp(amountToSend)
}

// Function to perform offramp operation
function offramp(amount) {
    amount = amount.div(new BigNumber(10).exponentiatedBy(18))
    amount = amount*dollarPrice2;
    console.log("Country 2 gets: "+ amount)
}

// Example usage
onramp(800); // Assuming the user input is 1000, dividing by dollar price and calling transfer
