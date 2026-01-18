"use client";

import { Button } from "@/src/components/ui/button";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";

export function ButtonCopyLink({ userId }: { userId: string }) {
  async function handleCopyLink() {
    try {
      const link = `${window.location.origin}/clinica/${userId}`;
      await navigator.clipboard.writeText(link);
      toast.success("Link de agendamento copiado com sucesso");
    } catch (err) {
      console.log(err);
      toast.error("Não foi possível copiar o link. Copie manualmente.");
    }
  }

  return (
    <Button className="hover:bg-emerald-400 cursor-pointer" onClick={handleCopyLink}>
      <LinkIcon className="h-5 w-5" />
    </Button>
  );
}
