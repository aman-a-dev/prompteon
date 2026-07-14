import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/icons/logo.svg"
      height={1024}
      width={1024}
      alt="logo"
      className="w-50"
      loading="eager"
      style={{ width: "100px", height: "auto" }}
    />
  );
}
