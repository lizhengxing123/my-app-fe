import { Button } from "@/components/ui/button";
import { ChartAreaIcon } from "lucide-react";
export default function ChartPage() {
  return (
    <div className="w-full">
      <Button>
        <ChartAreaIcon className="mr-0.5 h-4 w-4" />
        所有图表
      </Button>
    </div>
  );
}
