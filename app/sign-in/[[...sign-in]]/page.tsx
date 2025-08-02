import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignIn />
    </div>
  );
}

export const metadata = {
  title: "Sign In",
  description: "Sign in to your Resonex account",
};
