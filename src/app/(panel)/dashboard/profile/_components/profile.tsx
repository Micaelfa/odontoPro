"use client";

import { useProfileForm } from "./profile.form";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import Image from "next/image";
import ImgTeste from "@/public/foto1.png";
import { Label } from "@radix-ui/react-label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from '@/src/lib/utils';
import {ProfileFormData} from "@/src/app/(panel)/dashboard/profile/_components/profile.form"
import { Prisma } from "@/src/generated/prisma/client";
import {updateProfile} from "../_actions/update-profile"
import { toast } from "sonner";
import {formatPhone} from "@/src/utils/formatedPhone"
import { signOut, useSession} from "next-auth/react"
import { useRouter } from "next/navigation"

type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>
interface ProfileContentProps{
  user: UserWithSubscription
}

export default function ProfileContent({user} : ProfileContentProps) {

  const router = useRouter();
  const [selectedHours, setSelectedHours] = useState<string[]>(user.times ?? [])
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const {update} = useSession()

  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timezone
  });

  const timeZones = Intl.supportedValuesOf("timeZone").filter((zone) => 
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Cuiaba") ||
    zone.startsWith("America/Boa_Vista")

  );

  function generateTimeSlots(): string[] {
    const hours: string[] = [];
    for (let i = 8; i<=24; i++) {
      for (let j =0; j < 2; j++) {
        const hour = i.toString().padStart(2, "0") 
        const minute = (j * 30).toString().padStart(2, "0")
        hours.push(`${hour}:${minute}`)
      }
      
    }
    return hours;
  }

  const hours = generateTimeSlots();

  function toggleHour(hour: string) {
    setSelectedHours((prev) => prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort())
  }

  async function onSubit(values: ProfileFormData) {
    
    const response = await updateProfile({
      name: values.name,
      address: values.address,
      phone: values.phone,
      status: values.status === "active" ? true : false,
      timeZone:values.timeZone,
      times: selectedHours || []
    })

    if (response.error) {
      toast.error(response.error)
      return;
    }
    
      toast.success(response.data)
  }

  async function handleLogout(){
    await signOut();
    await update();
    router.replace("/")
  }

  return (
  <div className="w-full flex justify-center px-4 py-6 ">
      <div className="w-full max-w-md sm:max-w-xl lg:max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubit)}>
            <Card className="w-full">
              <CardHeader className="pb-4">
                <CardTitle className="w-full rounded-b-2xl bg-emerald-400 font-bold flex justify-center items-center py-2 text-white">
                  Meu Perfil
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* foto */}
                <div className="flex justify-center">
                  <div className="relative h-40 w-40 rounded-full overflow-hidden">
                    <Image
                      src={user.image ? user.image : ImgTeste}
                      alt="Foto da clínica"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* campos */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Nome Completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Digite o nome da clínica..."
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Endereço Completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Digite o endereço da clínica..."
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Contato da clínica
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Digite o telefone da clínica..."
                            onChange={(e) => {
                              const formattedValue = formatPhone(e.target.value)
                              field.onChange(formattedValue)
                            }}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Status da clínica
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full h-full">
                              <SelectValue placeholder="Selecione o Status da clínica" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                ATIVO (clínica aberta)
                              </SelectItem>
                              <SelectItem value="inactive">
                                INATIVA (clínica fechada)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label className="font-semibold">Configurar horarios da clinica</Label>

                    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-between mt-3" variant="outline">
                          Clique aqui para configurar os horarios da clinica
                          <ArrowRight className="w-5 h-5"/>
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle> Horarios da clinica</DialogTitle>
                          <DialogDescription>Selecione os horarios que a clinica estará aberta</DialogDescription>
                        </DialogHeader>

                        <section className="py-4">
                          <p className="text-sm text-muted-foreground mb-2">
                            Clique nos horários abaixo para marcar ou desmar:
                          </p>

                          <div className="grid grid-cols-5 gap-2">
                            {hours.map((hour) => (
                              <Button 
                                className={cn("h-10", selectedHours.includes(hour) && "border-2 border-emerald-500 text-primary")} 
                                variant="outline" 
                                key={hour}
                                onClick={() => toggleHour(hour)}
                              >
                                {hour}
                              </Button>
                            ))}
                          </div>
                        </section>

                        <Button 
                          className="w-full" 
                          onClick={() => setDialogIsOpen(false)} 
                        >
                          Salvar horarios 
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <FormField
                    control={form.control}
                    name="timeZone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          Selecione fuso-horario
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full h-full">
                              <SelectValue placeholder="Selecione seu fuso-horario" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeZones.map((zone) => (
                                <SelectItem key={zone} value={zone}>
                                    {zone}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400">
                    Salvar alterações
                  </Button>

                </div>
              </CardContent>
            </Card>
          </form>
        </Form>

      <section className="mt-4">
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="cursor-pointer"
        >
          Sair da conta
        </Button>
      </section>
      </div>
    </div>
  );
}
