import { NextRequest, NextResponse } from 'next/server';

const isLocal = (process.env.APP_ENV || "local") === "local";

export async function GET(req: NextRequest) {
  if (isLocal) {
    // Bouchon local : simule une réponse de succès
    return NextResponse.json({
      user_id: "mock-user",
      company_id: "mock-company",
      email: "mock@local.test",
      valid: true,
    });
  }

  const cookie = req.headers.get('cookie');

  // Proxy la requête vers le service auth
  const authServiceUrl = process.env.AUTH_SERVICE_URL || "http://auth-service";
  const response = await fetch(`${authServiceUrl}/verify`, {
    method: 'GET',
    headers: {
      cookie: cookie || '',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data, { status: 200 });
}