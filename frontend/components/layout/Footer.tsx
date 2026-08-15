import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 py-10 text-gray-300">

      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 md:flex-row">

        <div>
          <h3 className="text-2xl font-bold text-white">
            SkyBook
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Your journey starts here.
          </p>
        </div>

        <div className="flex gap-6 text-sm">
          <Link
            href="/privacy"
            className="hover:text-white"
          >
            Privacy
          </Link>

          <Link
            href="/terms"
            className="hover:text-white"
          >
            Terms
          </Link>

          <Link
            href="/contact"
            className="hover:text-white"
          >
            Support
          </Link>
        </div>

      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-slate-800 px-6 pt-6 text-sm text-gray-500">
        © 2026 SkyBook. All rights reserved.
      </div>

    </footer>
  );
}