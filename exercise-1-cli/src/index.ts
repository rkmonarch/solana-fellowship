#!/usr/bin/env node

import { Command } from "commander";
import {
  Keypair,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import fs from "fs";
import path from "path";

const program = new Command();

program
  .name("rksol")
  .description("CLI tool to interact with the Solana blockchain")
  .version("1.0.0");

// Command to generate a new keypair
program
  .command("generate")
  .description("Generate a new keypair")
  .action(async () => {
    const keypair = Keypair.generate();
    const secretKey = JSON.stringify(Array.from(keypair.secretKey));
    const filePath = path.join(process.cwd(), "keypair.json");

    fs.writeFileSync(filePath, secretKey);
    console.log(`Keypair generated and saved to ${filePath}`);
    console.log(`Public Key: ${keypair.publicKey.toBase58()}`);
  });

// Command to request an airdrop
program
  .command("airdrop")
  .description("Request an airdrop")
  .argument("<publicKey>", "Public key to request airdrop for")
  .action(async (publicKey) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const airdropSignature = await connection.requestAirdrop(
      new PublicKey(publicKey),
      LAMPORTS_PER_SOL
    );

    await connection.confirmTransaction(airdropSignature);
    console.log(`Airdrop requested for ${publicKey}`);
  });

// Command to send SOL to another public key
program
  .command("send")
  .description("Send SOL to another public key")
  .argument("<toPublicKey>", "Recipient public key")
  .argument("<amount>", "Amount of SOL to send")
  .action(async (toPublicKey, amount) => {
    const fromSecretKey = Uint8Array.from(
      JSON.parse(
        fs.readFileSync(path.join(process.cwd(), "keypair.json"), "utf8")
      )
    );
    const fromKeypair = Keypair.fromSecretKey(fromSecretKey);

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: new PublicKey(toPublicKey),
        lamports: LAMPORTS_PER_SOL * parseFloat(amount),
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      fromKeypair,
    ]);
    console.log(`Transaction successful with signature: ${signature}`);
  });

program.parse(process.argv);
