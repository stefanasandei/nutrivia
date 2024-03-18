import Link from "next/link";

export default function Footer() {
  return (
    <footer className="m-4 border-t-2 border-border">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm sm:text-center">
          © 2024{" "}
          <a
            target="_blank"
            href="https://stefan-asandei.netlify.app/"
            className="hover:underline"
          >
            Asandei Stefan-Alexandru
          </a>
          . All Rights Reserved.
        </span>
        <ul className="mt-3 flex flex-wrap items-center text-sm font-medium sm:mt-0">
          <li>
            <Link href="/about" className="me-4 hover:underline md:me-6">
              About
            </Link>
          </li>
          <li>
            <Link href="/" className="me-4 hover:underline md:me-6">
              Food Catalog
            </Link>
          </li>
          <li>
            <Link href="/forum" className="me-4 hover:underline md:me-6">
              Forum
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
