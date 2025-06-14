import { NextRequest, NextResponse } from 'next/server';

const isLocal = (process.env.APP_ENV || "local") === "local";

export async function POST(req: NextRequest) {
  console.log("APP_ENV:", process.env.APP_ENV);
  console.log("isLocal:", isLocal);

  if (isLocal) {
    // Bouchon local : simule une réponse de succès
    console.log("Bouchon local utilisé");
    const response = NextResponse.json({
      user_id: "mock-user",
      company_id: "mock-company",
      email: "mock@local.test",
      valid: true,
    });
    response.headers.set('Set-Cookie', 'access_token=fake-token; HttpOnly; Path=/;');
    return response;
  }

  const body = await req.json();
  const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://auth-service";
  const response = await fetch(`${authServiceUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const setCookie = response.headers.get('set-cookie');
  const data = await response.json();

  const nextResponse = NextResponse.json(data, { status: response.status });
  if (setCookie) {
    nextResponse.headers.set('Set-Cookie', setCookie);
  }

  return nextResponse;
}