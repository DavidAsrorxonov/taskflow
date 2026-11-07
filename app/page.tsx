"use client";

import TaskDashboard from "@/components/task-dashboard";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-900">
      <div className="mx-auto max-w-2xl">
        <Authenticated>
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">TaskFlow</h1>
              <p className="text-zinc-500">Your personal workspace</p>
            </div>
            <UserButton />
          </header>

          <TaskDashboard />
        </Authenticated>

        <Unauthenticated>
          <section className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <h1 className="text-4xl font-bold">TaskFlow</h1>
            <p className="mt-3 text-zinc-500">
              Manage tasks and stay synchronized.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <SignInButton mode="modal">
                <button className="rounded-lg border px-5 py-3">Sign in</button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="rounded-lg bg-zinc-900 px-5 py-3 text-white">
                  Create account
                </button>
              </SignUpButton>
            </div>
          </section>
        </Unauthenticated>

        <AuthLoading>
          <p className="text-center text-zinc-500">Connecting securely...</p>
        </AuthLoading>
      </div>
    </main>
  );
}
