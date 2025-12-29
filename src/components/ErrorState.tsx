import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
};

export default function ErrorState({
  title = "Oops! Something went wrong",

}: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <Image
       src="/image/20943844.jpg"
              alt="Unauthorized"
        width={280}
        height={280}
        className="opacity-90"
        priority
      />

      <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-800">
        {title}
      </h2>

         <Link href="/auth/login">
              <Button className="mt-4">Login</Button>
            </Link>
    </div>
  );
}
