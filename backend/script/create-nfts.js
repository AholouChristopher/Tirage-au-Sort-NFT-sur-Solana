const { Connection, clusterApiUrl, PublicKey, Keypair} = require("@solana/web3.js");
const { Metaplex, keypairIdentity, irysStorage } = require("@metaplex-foundation/js");
const fs = require("fs");

const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

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


  const nftCollection = [
    {
        name: "NFT Bronze #4",
        description: "NFT récompense niveau Bronze",
        image: "https://picsum.photos/200",
        attributes: [
            { trait_type: "Rareté", value: "Bronze" }
        ]
    },
    {
        name: "NFT Argent #4",
        description: "NFT récompense niveau Argent",
        image: "https://picsum.photos/200",
        attributes: [
            { trait_type: "Rareté", value: "Argent" }
        ]
    },
    {
        name: "NFT Or #4",
        description: "NFT récompense niveau Or",
        image: "https://picsum.photos/200",
        attributes: [
            { trait_type: "Rareté", value: "Or" }
        ]
    },
    {
        name: "NFT Diamant #4",
        description: "NFT récompense niveau Diamant",
        image: "https://picsum.photos/200",
        attributes: [
            { trait_type: "Rareté", value: "Diamant" }
        ]
    },
    {
        name: "NFT Légendaire #4",
        description: "NFT récompense niveau Légendaire",
        image: "https://picsum.photos/200",
        attributes: [
            { trait_type: "Rareté", value: "Légendaire" }
        ]
    }
];

// Fonction pour uploader les métadonnées
const uploadMetadata = async (metadata) => {
    try {
        console.log(`Uploading métadonnées pour : ${metadata.name}`);
        
        // Créer l'objet de métadonnées au format Metaplex
        const metadataObject = {
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            attributes: metadata.attributes,
            properties: {
                files: [{ uri: metadata.image, type: "image/jpeg" }]
            }
        };

        // Upload les métadonnées
        const { uri } = await metaplex.nfts().uploadMetadata(metadataObject);
        console.log(`✅ Métadonnées uploadées à : ${uri}`);
        return uri;
    } catch (error) {
        console.error(`❌ Erreur upload métadonnées pour ${metadata.name}:`, error);
        throw error;
    }
}

const createNFTs = async () => {

    console.log("Début de la création des NFTs...");
    const createdNFTs = [];

    for (const metadata of nftCollection) {
        try {
            console.log(`Création du NFT : ${metadata.name}`);

            // Upload les métadonnées
            const uri = await uploadMetadata(metadata);
            console.log(`✅ Métadonnées uploadées avec succès! URI: ${uri}`);

            // Créer le NFT
            const { nft } = await metaplex.nfts().create({
                uri: uri,
                name: metadata.name,
                sellerFeeBasisPoints: 1000, // 10%
            });
            console.log(`✅ NFT créé avec succès! Mint address: ${nft.address.toString()}`);
            createdNFTs.push(nft);
        } catch (error) {
            console.error(`❌ Erreur lors de la création du NFT ${metadata.name}:`, error);
        }
    }

    console.log("NFTs créés avec succès:", createdNFTs.map(nft => nft.address.toBase58()));
    return createdNFTs;
};

createNFTs().catch(console.error);
