import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
  knoxId?: string;
  name?: string;
  epid?: string;
  company?: string;
  dept?: string;
  region?: string;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "archxplorer-account",
    password: process.env.COOKIE_PASSWORD!,
    cookieOptions: {
      secure: false,
      sameSite: "lax",
      maxAge: 86400,
    },
  });
}
