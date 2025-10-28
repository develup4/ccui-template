import { NextRequest, NextResponse } from "next/server";
import getSession from "@/app/(commons)/globals/session";

const publicUrlKeywords: string[] = ["docs", "credentials", "images", "fonts"];

const isPublicUrl = (url: string): boolean => {
  // Home
  if (url === "/") return true;

  // Check url keyword
  for (let bundle of publicUrlKeywords) {
    if (url.includes(bundle)) return true;
  }
  return false;
};

const determineCountry = (
  requestCountry: string | undefined,
  acceptLanguage: string | null,
  sessionRegion: string | undefined
): string => {
  let region = "en";

  if (sessionRegion) {
    return sessionRegion;
  } else if (requestCountry) {
    return requestCountry === "KR" ? "ko" : "en";
  } else if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, qValue] = lang.trim().split(";q=");
        return {
          lang: code,
          q: qValue ? parseFloat(qValue) : 1.0,
        };
      })
      .sort((a, b) => b.q - a.q);

    const primaryLang = languages[0]?.lang.toLowerCase();
    return primaryLang.startsWith("ko") ? "ko" : "en";
  } else {
    return region;
  }
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const currentUrl = request.nextUrl.pathname;

  // Select docs country
  if (currentUrl === "/support/docs") {
    const region = determineCountry(
      request.geo?.country,
      request.headers.get("accept-language"),
      session.region
    );
    const url = request.nextUrl.clone();
    url.pathname = `/support/docs/${region}`;
    return NextResponse.redirect(url);
  }

  // Redirect to login
  if (!session.id || !session.knoxId) {
    if (!isPublicUrl(currentUrl)) {
      return NextResponse.redirect(
        new URL(
          `${process.env.LOGIN_REQUEST_URL!}?redirectUrl=${encodeURIComponent(
            currentUrl
          )}`,
          request.url
        )
      );
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicion.png).*)"],
};
