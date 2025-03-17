const express = require("express");
const cors = require("cors");
const fs = require("fs");

const { Connection, PublicKey, Keypair, clusterApiUrl } = require("@solana/web3.js");
const { Metaplex, keypairIdentity, irysStorage } = require("@metaplex-foundation/js");

// Creation du serveur
const app = express();
app.use(cors());
app.use(express.json());

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Charger le wallet du backend
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync("server-wallet.json")));
const serverWallet = Keypair.fromSecretKey(secretKey);
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(serverWallet))
  .use(
    irysStorage({
      address: "https://devnet.irys.xyz",
      providerUrl: clusterApiUrl("devnet"),
      timeout: 60000,
    })
  );

console.log("Server Wallet Address:", serverWallet.publicKey.toBase58());

// Liste NFT pour le Tirage
const nftList = [
  "NFT_MINT_ADDRESS_1",
  "NFT_MINT_ADDRESS_2",
  "NFT_MINT_ADDRESS_3"
];

app.post("/draw", async (req, res) => {
  const { playerPublicKey } = req.body;


  if (!playerPublicKey || typeof playerPublicKey !== "string") {
    return res.status(400).json({ error: "Adresse publique invalide" });
  }

  try {
    const winnerAddress = new PublicKey(playerPublicKey);
    console.log(`✅ Adresse gagnante valide : ${winnerAddress.toBase58()}`);

    const randomNftMint = nftList[Math.floor(Math.random() * nftList.length)]; // Choisir un NFT au hasard (mais pas securisé)

    try {
      console.log(`Gagnant : ${winnerAddress.toBase58()} - NFT: ${randomNftMint}`);

      // récupérer l'NFT
      const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(randomNftMint) });

      // envoyer l'NFT au gagnant
      await metaplex.nfts().transfer({
        nftOrSft: nft,
        toOwner: winnerAddress
      });

      console.log(`NFT envoyé à ${winnerAddress.toBase58()}`);
      res.json({ success: true, nft: { name: nft.name, image: nft.uri } });
    } catch (error) {
      console.error("Erreur lors du transfert du NFT :", error);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error("Erreur de conversion de l'adresse publique :", error);
    return res.status(400).json({ error: "Adresse publique invalide" });
  }
});

const PORT = process.env.PORT || 5000; // Utilise un port défini en .env ou 5000 par défaut
app.listen(PORT, () => console.log(`Backend en ligne sur http://localhost:${PORT}`));
