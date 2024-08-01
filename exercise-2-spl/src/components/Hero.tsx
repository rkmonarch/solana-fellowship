"use client";

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  createMintToInstruction,
  MINT_SIZE,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToCheckedInstruction,
} from "@solana/spl-token";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Hero() {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");
  const [mint, setMint] = useState<PublicKey | null>(null);

  async function createToken() {
    if (!publicKey) {
      console.error("Wallet is not connected");
      return;
    }

    const mintKeypair = Keypair.generate();
    const lamports = await connection.getMinimumBalanceForRentExemption(
      MINT_SIZE
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        publicKey,
        publicKey
      )
    );
    try {
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash()
      ).blockhash;

      const signature = await sendTransaction(transaction!, connection, {
        signers: [mintKeypair],
      });
      await connection.confirmTransaction(signature, "confirmed");
      console.log(
        "Token created with public key:",
        mintKeypair.publicKey.toBase58()
      );
      setMint(mintKeypair.publicKey);
      toast.success(
        `Token created successfully!, Mint: ${mintKeypair.publicKey.toBase58()}`
      );
    } catch (error) {
      console.error("Failed to create token:", error);
      toast.error("Failed to create token.");
    }
  }

  async function mintTokens() {
    if (!publicKey) {
      console.error("Wallet is not connected");
      return;
    }

    if (!mint) {
      console.error("Mint not set.");
      return;
    }

    const ata = getAssociatedTokenAddressSync(mint, publicKey);

    console.log("ata", ata.toBase58());

    let tx = new Transaction();

    tx.add(
      createAssociatedTokenAccountInstruction(
        publicKey!, // payer
        ata, // ata
        publicKey!, // owner
        mint!
      )
    );

    tx.add(
      createMintToCheckedInstruction(
        mint!, // mint
        ata, // receiver (should be a token account)
        publicKey, // mint authority
        100 * LAMPORTS_PER_SOL, // amount. if your decimals is 8, you mint 10^8 for 1 token.
        9 // decimals
      )
    );

    tx.feePayer = publicKey;
    tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

    try {
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Tokens minted:", 100);
      toast.success("Tokens minted successfully!");
    } catch (error) {
      console.error("Failed to mint tokens:", error);
      toast.error("Failed to mint tokens.");
    }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-4">Check the console for actions.</div>
      <div className="text-center mb-4">
        Make sure you are connected to the wallet.
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={createToken}
          >
            Create Token
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => mintTokens()}
          >
            Mint Tokens
          </button>
        </div>
      </div>
    </div>
  );
}
