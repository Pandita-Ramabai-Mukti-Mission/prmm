import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "GitHub OAuth env vars are not configured" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieState = request.cookies.get("decap_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return new NextResponse(
      renderHtml("error", JSON.stringify({ message: "Invalid OAuth state" })),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || tokenData.error) {
    return new NextResponse(
      renderHtml("error", JSON.stringify(tokenData)),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  const html = renderHtml(
    "success",
    JSON.stringify({ token: tokenData.access_token, provider: "github" })
  );

  const response = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
  response.cookies.delete("decap_oauth_state");

  return response;
}

function renderHtml(status: "success" | "error", payload: string) {
  const message = `authorization:github:${status}:${payload}`;
  return `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        function receiveMessage(message) {
          window.opener.postMessage(
            ${JSON.stringify(message)},
            message.origin
          );
          window.removeEventListener("message", receiveMessage, false);
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;
}
