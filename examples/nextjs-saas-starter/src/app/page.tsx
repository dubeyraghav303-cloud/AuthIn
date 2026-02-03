'use client';
import { useUser } from '@authkit/next';

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">AuthKit SaaS Starter</h1>

        {user ? (
          <div className="p-6 border rounded-lg bg-zinc-50 dark:bg-zinc-900">
            <p className="mb-2">Logged in as:</p>
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              {user.email}
            </code>
          </div>
        ) : (
          <div className="flex gap-4">
            <a
              href="http://localhost:3000/auth/login"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Login
            </a>
            <a
              href="http://localhost:3000/auth/register"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            >
              Register
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
