<script setup>

import { ref } from "vue";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import axios from "axios";

const walletAddress = ref(null);
const winnerNft = ref(null);
const connection = new Connection(clusterApiUrl("devnet"));

//Connection avec Wallet Phantom
const connectWallet = async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const response =  await window.solana.connect();
      walletAddress.value = response.publicKey.toString();
    } catch (error) {
      console.error("Erreur de connection au wallet", error);   
    }
  } else {
    console.error("Installer un Wallet SOLANA");
  }
}

// Participer au tirage au sort
const drawNft = async () => {
  if(!walletAddress.value) {
    alert ("Connectez votre wallet");
    return;
  }
  try {
    const { data } = await axios.post("http://localhost:5173/draw",{
      playerPubKey: walletAddress.value,
    });
    winnerNft.value = data;
  } catch (error){
    console.error("Erreur lors du tirage :", error);
    alert("Erreur lors du tirage au sort !");
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold mb-6">🎟️ NFT Lucky Draw</h1>
    
    <button v-if="!walletAddress" @click="connectWallet" 
      class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md">
      Connecter Phantom Wallet
    </button>

    <div v-else class="text-center">
      <p class="mb-2 text-lg">📌 <strong>Adresse :</strong> {{ walletAddress }}</p>

      <button @click="drawNft" class="bg-green-500 px-4 py-2 mt-4 rounded-lg shadow-md">
        🎲 Tirer un NFT !
      </button>

      <div v-if="winnerNft" class="mt-6">
        <h2 class="text-xl font-semibold">🎉 Félicitations ! 🎉</h2>
        <p>Tu as gagné un NFT 🎨</p>
        <img :src="winnerNft.image" alt="NFT Gagné" class="mt-4 w-64 rounded-lg shadow-md" />
        <p class="mt-2 text-sm text-gray-400">{{ winnerNft.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
