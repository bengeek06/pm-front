"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch("http://localhost:5002/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Identifiants invalides");
      }

      const data = await res.json();
      console.log("Réponse login :", data);
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        router.push("/projects");
      } else {
        throw new Error("Token manquant dans la réponse");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail size={16} />
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Votre email"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock size={16} />
                </span>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Votre mot de passe"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}