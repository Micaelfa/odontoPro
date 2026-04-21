import { Button } from "@/src/components/ui/button";
import getSession from "@/src/lib/getSession";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ButtonCopyLink } from "./_components/button-copy-link";
import { Reminders } from "./_components/reminder/reminders";
import { Appointments } from "./_components/appointments/appointments";

export default async function Dashboard() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;

  return (
    <main>
      <div className="space-x-2 flex items-center justify-end">
        <Link href={`/clinica/${userId}`} target="_blank">
          <Button className="bg-emerald-500 hover:bg-emerald-400 flex-1 md:flex-0 cursor-pointer">
            <Calendar className="w-5 h-5" />
            <span>Novo agendamento</span>
          </Button>
        </Link>

        <ButtonCopyLink userId={userId} />
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
        <Appointments userId={userId} />
        <Reminders userId={userId} />
      </section>
    </main>
  );
}