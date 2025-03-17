const { Connection, clusterApiUrl, PublicKey, Keypair } = require("@solana/web3.js");
const fs = require("fs");


const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("server-wallet.json")));
const keypair = Keypair.fromSecretKey(secretKey);
const publicKey = keypair.publicKey;

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const getBalance = async () => {
    const balance = await connection.getBalance(publicKey);
    console.log(`Solde : ${balance/1e9} SOL `);
    console.log(`Adresse publique: ${publicKey.toBase58()}`);

};

getBalance();

