import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-background bg-gradient">
      <div>
        <p className="font-extrabold text-4xl text-white mb-2">404</p>
        <p className="text-2xl text-gray-300">Sorry, we couldn't find this</p>
        <p className="text-2xl text-gray-300 mb-3">Page.</p>
        <p className="text-sm text-gray-400">
          But don't worry, you can find plenty of other
        </p>
        <p className="text-sm text-gray-400 mb-5">Things on our homepage.</p>
        <Link href="/">
          <button className="w-40 h-8 border border-sky-500 rounded-lg animate-pulse hover:animate-none hover:bg-sky-500 text-xs text-white">
            Back to home
          </button>
        </Link>
      </div>
    </div>
  );
}
