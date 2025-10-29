"use client";

import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import FormInput from "../(components)/form/input";
import FormLoadingButton from "../(components)/form/loading-button";

export default function SignUpForm() {
  const [state, dispatch] = useFormState(createAccount, null);

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
      <p className="font-poppins font-bold text-2xs mt-2 mb-0.5">User Name</p>
      <FormInput
        name="username"
        type="text"
        placeholder="User Name"
        required
        errors={state?.fieldErrors?.name}
        minLength={3}
        maxLength={20}
      />
      <p className="font-poppins font-bold text-2xs mt-2 mb-0.5">Password</p>
      <FormInput
        name="password"
        type="password"
        placeholder="Password"
        minLength={4}
        required
        errors={state?.fieldErrors?.password}
      />
      <p className="font-poppins font-bold text-2xs mt-2 mb-0.5">
        Confirm Password
      </p>
      <FormInput
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        required
        minLength={4}
        errors={state?.fieldErrors?.confirmPassword}
      />
      <div className="mt-8" />
      <FormLoadingButton text="Create Account" textSize="text-sm" />
    </form>
  );
}
