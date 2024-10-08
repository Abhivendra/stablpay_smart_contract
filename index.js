const BigNumber = require("bignumber.js");
const ethers = require("ethers");
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
} = require("@solana/web3.js");
const {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} = require("@solana/spl-token");

let dollarPrice1 = 80.0; // price of dollar in first country, can be changed
let dollarPrice2 = 10.0; //price of dollar in second country, can be changed

// Function to perform onramp operation
function onramp(input) {
  if (typeof input === "number" && !isNaN(input)) {
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
  console.log("Sending " + amountBig.toFixed() + " USDT");
  //ethersjs call to contract : 0xA9eA7ab695B8040379851b008261948A8B46ffF4, function transfer(to, value)
  //to is the wallet address of the storage wallet (make it your wallet for now). value is amount
  offramp(amountToSend);
}

// Function to perform offramp operation
function offramp(amount) {
  amount = amount.div(new BigNumber(10).exponentiatedBy(18));
  amount = amount * dollarPrice2;
  console.log("Country 2 gets: " + amount);
}

// Example usage
onramp(800); // Assuming the user input is 1000, dividing by dollar price and calling transfer

const transferUSDT = async () => {
    // Solana connection
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  
    // Load sender wallet (private key)
    const senderSecretKey = Uint8Array.from([/* Add sender's private key array here */]);
    const senderWallet = Keypair.fromSecretKey(senderSecretKey);
  
    // Receiver's public address
    const receiverPublicKey = new PublicKey('Receiver_Wallet_Public_Key');
  
    // USDT SPL token address on Solana mainnet
    const usdtMintAddress = new PublicKey('Es9vMFrzaCERTrsBzUL8uJckSCaWMrWQRNo7JhF8nY3');
  
    // Get or create associated token accounts for the sender and receiver
    const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      senderWallet,
      usdtMintAddress,
      senderWallet.publicKey
    );
  
    const receiverTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      senderWallet,
      usdtMintAddress,
      receiverPublicKey
    );
  
    // Amount to transfer (in lamports; 1 USDT = 1000000 lamports)
    const amount = 1000000; // Transfer 1 USDT
  
    // Create the transaction
    const transaction = new Transaction().add(
      createTransferInstruction(
        senderTokenAccount.address, // Sender's token account
        receiverTokenAccount.address, // Receiver's token account
        senderWallet.publicKey, // Sender's wallet public key (signer)
        amount,
        [],
        9 // Decimals for USDT
      )
    );
  
    // Send the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [senderWallet]);
  
    console.log('Transaction successful with signature:', signature);
  };
  
  transferUSDT().catch((err) => {
    console.error('Error transferring USDT:', err);
  });