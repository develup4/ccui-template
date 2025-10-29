import { Metadata } from "next";
import { IoIosLogIn } from "react-icons/io";
import SignInForm from "./form";
import Link from "next/link";

export const metadata: Metadata = { title: "Sign In" };

interface SignInPageProps {
  searchParams: { redirectUrl: string };
}

export default function SignInPage({
  searchParams: { redirectUrl },
}: SignInPageProps) {
  return (
    <main className="size-full">
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <IoIosLogIn className="size-6 mr-1 mt-0.5" />
          <p className="font-bold text-2xl text-white">Get started</p>
        </div>
        <p className="font-poppins text-xs mb-6">
          Sign in and Explorer ArchXplorer
        </p>
      </div>
      <SignInForm redirectUrl={redirectUrl} />
      <Link href={process.env.LOGIN_REQUEST_URL!}>
        <p className="w-full h-12 flex justify-center items-center rounded-lg p-3 ring-1 ring-sky-500/80 hover:ring-2 font-poppins text-xs text-white mt-2">
          AD Login
        </p>
      </Link>
      <div className="flex justify-center text-xs mt-2">
        <p className="font-poppins">Do not have an account?</p>
        <Link href="/credentials/signup" className="font-bold text-white ml-1">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
