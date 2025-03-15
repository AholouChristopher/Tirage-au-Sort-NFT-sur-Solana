//script pour aidrop Wallet loterie 

const { Connection, clusterApiUrl, PublicKey, LAMPORTS_PER_SOL, Keypair } = require("@solana/web3.js");
const fs = require("fs");

//charger la clé privée du fichier
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("server-wallet.json")));
const keypair = Keypair.fromSecretKey(secretKey);
const publicKey = keypair.publicKey;

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const requestAirdrop =  async () => {
    console.log("Demande d'airdrop en cours...");
    const signature = await connection.requestAirdrop(publicKey,LAMPORTS_PER_SOL);
    console.log(`Airdrop réussi ! Transaction : https://explorer.solana.com/tx/${signature}?cluster=devnet`);
};

requestAirdrop();
