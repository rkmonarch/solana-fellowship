import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="fixed bg-white z-10 w-full">
        <Navbar />
      </div>
    </div>
  );
}
