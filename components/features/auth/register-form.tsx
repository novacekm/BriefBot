"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/actions/auth";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, undefined);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle as="h1" className="text-2xl font-semibold tracking-tight">
          Create account
        </CardTitle>
        <CardDescription>Start using BriefBot</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.ch"
              autoComplete="email"
              required
              disabled={isPending}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              disabled={isPending}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              At least 8 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              disabled={isPending}
              className="h-11"
            />
          </div>

          {state?.error && (
            <div
              role="alert"
              className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
            >
              {state.error}
            </div>
          )}

          <Button type="submit" className="h-11 w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
