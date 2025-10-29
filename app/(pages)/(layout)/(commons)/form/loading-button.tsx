"use client";

import { useFormStatus } from "react-dom";
import FormButton from "./button";
import React from "react";

interface FormLoadingButtonProps {
  children: React.ReactNode;
}

export default function FormLoadingButton({
  children,
}: FormLoadingButtonProps) {
  const childrenArray = React.Children.toArray(children);
  const { pending } = useFormStatus();

  return <FormButton loading={pending} children={childrenArray} />;
}
