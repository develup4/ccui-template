"use client";

import { useFormStatus } from "react-dom";
import FormButton from "./button";

export default function FormLoadingButton(props: any) {
  const { pending } = useFormStatus();
  return <FormButton loading={pending} {...props} />;
}
