import { POST } from "./route";
import { NextRequest } from "next/server";

describe("POST /api/login", () => {
  it("renvoie un mock en local", async () => {
    process.env.APP_ENV = "local";
    const req = new NextRequest("http://localhost/api/login", {
      method: "POST",
      body: JSON.stringify({ email: "test", password: "test" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.user_id).toBe("mock-user");
    expect(json.company_id).toBe("mock-company");
  });

  // Tu peux ajouter d'autres tests pour le mode "dev" ou "docker"
});