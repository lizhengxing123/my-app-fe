import { Button } from "@/components/ui/button";
import { Airplay } from "lucide-react";

export default function Home() {
  return (
    <div className="px-14 py-4">
      <Button>
        <Airplay className="mr-0.5 h-4 w-4" />
        首页
      </Button>
    </div>
  );
}
