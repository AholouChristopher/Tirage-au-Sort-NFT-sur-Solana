const { Keypair } = require("@solana/web3.js");
const fs = require("fs");

// Générer un nouveau wallet
const wallet = Keypair.generate()

const walletJson = JSON.stringify(Array.from(wallet.secretKey))

fs.writeFileSync("server-wallet.json", walletJson)


console.log("Wallet généré avec succès !")
console.log(`Adresse publique:${wallet.publicKey.toBase58()}`)




