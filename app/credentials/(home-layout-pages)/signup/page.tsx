import { Metadata } from "next";
import { LuUserPlus } from "react-icons/lu";
import SignUpForm from "./form";
import Link from "next/link";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignInPage() {
  return (
    <main className="size-full mt-20">
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <LuUserPlus className="size-6 mr-1 mt-0.5" />
          <p className="font-bold text-2xl text-white">Create an account</p>
        </div>
        <p className="font-poppins text-xs mb-6">
          Sign up and wait for approval
        </p>
      </div>
      <SignUpForm />
      <div className="flex justify-center text-xs mt-1.5">
        <p className="font-poppins">Have you an account already?</p>
        <Link href="/credentials/signin" className="font-bold text-white ml-1">
          Sign In
        </Link>
      </div>
    </main>
  );
}
