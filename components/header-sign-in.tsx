"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeaderSignInButton() {
  return (
    <Button
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      Sign in with Google
      <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  );
}
