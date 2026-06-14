import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center">
      <div className="flex flex-col w-full container mx-auto">
        <h2 className="text-4xl max-w-2xl mb-4">404 - Sidan hittades inte</h2>
        <div className="prose prose-lg not-md:prose-base">
          <p>
            Sidan du letar efter finns inte eller har flyttats.{" "}
            <Button
              variant="outline"
              icon={<ArrowLeft />}
              className="max-w-fit mt-4"
              href="/"
            >
              Tillbaka hem
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
}
