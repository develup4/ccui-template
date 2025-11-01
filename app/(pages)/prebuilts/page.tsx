import { redirect } from "next/navigation";

export default async function PrebuiltsPage() {
  const initialPage = "/prebuilts/ip-models";
  redirect(initialPage);
}
