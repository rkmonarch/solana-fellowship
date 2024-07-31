"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ConnectButton from "./ConnectButton";

export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between px-4 md:px-6 py-[14px] border-b-[0.8px] border-black border-opacity-10">
      <div className="hidden md:flex items-center bg-gray-100 py-2 px-4 w-full max-w-[32rem] space-x-3 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-[18px] w-[18px] opacity-30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.4"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div className="flex items-center gap-2">
        <ConnectButton />
      </div>
    </nav>
  );
}
