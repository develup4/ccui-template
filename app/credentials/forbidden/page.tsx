import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-background bg-gradient">
      <div>
        <p className="font-extrabold text-4xl text-white mb-2">403</p>
        <p className="text-2xl text-gray-300 mb-4">Forbidden!</p>
        <p className="text-sm text-gray-400">
          You don't have the required permissions
        </p>
        <p className="text-sm text-gray-400 mb-5">to view this page.</p>
        <Link href="/">
          <button className="w-40 h-8 border border-sky-500 rounded-lg animate-pulse hover:animate-none hover:bg-sky-500 text-xs text-white">
            Back to home
          </button>
        </Link>
      </div>
    </div>
  );
}
