import { NextRequest, NextResponse } from "next/server";

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_OAUTH_CLIENT_ID is not configured" },
      { status: 500 }
    );
  }

  const { origin } = new URL(request.url);
  const redirectUri = `${origin}/api/decap/callback`;
  const state = crypto.randomUUID();

  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl.toString());
  response.cookies.set("decap_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
