"use client";

import { Button } from "@/components/ui/button";
import { Airplay } from "lucide-react";
import { toast } from "sonner";


export default function Home() {
  
  return (
    <div className="px-14 py-4">
      <Button onClick={() => toast.success("成功！")}>
        <Airplay className="mr-0.5 h-4 w-4" />
        首页
      </Button>
    </div>
  );
}
