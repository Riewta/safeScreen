import Image from "next/image";
import Link from "next/link";

export function HeroBanner({ squareMobile }: { squareMobile?: boolean } = {}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-black ${
        squareMobile ? "pb-[43%] md:pb-[43%]" : "pb-[43%]"
      }`}
    >
      <Link href="/products" className="absolute inset-0 block">
        <Image
          src="/banner_promotions/21-9.png"
          alt="SafeScreen Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </Link>
    </div>
  );
}
