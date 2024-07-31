"use client";

import React from "react";
import Navbar from "../Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="fixed bg-white z-10 w-full">
        <Navbar />
      </div>
    </div>
  );
}
