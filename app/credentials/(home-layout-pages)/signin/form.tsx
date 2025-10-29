"use client";

import { useFormState } from "react-dom";
import { login } from "./actions";
import FormInput from "../(components)/form/input";
import FormLoadingButton from "../(components)/form/loading-button";

interface SignInFormProps {
  redirectUrl: string;
}

export default function SignInForm({ redirectUrl }: SignInFormProps) {
  const [state, dispatch] = useFormState(
    login.bind(null, { redirectUrl }),
    null
  );

  return (
    <form action={dispatch} className="flex flex-col">
      <p className="font-poppins font-bold text-2xs mb-0.5">Knox Portal ID</p>
      <FormInput
        name="knoxId"
        type="text"
        data-testid="knoxId"
        placeholder="Knox Portal ID"
        required
        errors={state?.fieldErrors?.knoxId}
      />
      <p className="font-poppins font-bold text-2xs mt-2 mb-0.5">Password</p>
      <FormInput
        name="password"
        type="password"
        data-testid="password"
        placeholder="Password"
        minLength={4}
        required
        errors={state?.fieldErrors?.password}
      />
      <div className="mt-4" />
      <FormLoadingButton text="Login" textSize="text-xs" />
    </form>
  );
}
