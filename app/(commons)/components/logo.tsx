import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/favicon.png"
        className="hover:animate-pulse"
        width={30}
        height={30}
        alt={""}
      />
    </Link>
  );
}
