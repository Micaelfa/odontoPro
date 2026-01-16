"use client"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/src/components/ui/dialog"
import { Pencil, Plus, Trash } from "lucide-react"
import { useState } from "react"
import { DialogService } from "./dialog-service"
import { Service } from "@/src/generated/prisma/client"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { deleteService } from "../_actions/delete-service"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog"

interface ServicesListProps {
  services: Service[]
}

export function ServicesList({ services }: ServicesListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<null | Service>(null)

  async function handleDeleteService(serviceId: string) {
    const response = await deleteService({ serviceId })

    if (response.error) {
      toast(response.error)
      return
    }

    toast.success(response.data)
  }

  async function handleEditService(service: Service) {
    setEditingService(service);
    setIsDialogOpen(true);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <section className="mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl md-text-2xl font-bold">Serviços</CardTitle>

            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus className="w-4 h-4 " />
              </Button>
            </DialogTrigger>

            <DialogContent 
              onInteractOutside={(e) => {
                e.preventDefault();
                setIsDialogOpen(false);
                setEditingService(null);

              }}
            >
              <DialogService
                closeModal={() => {
                  setIsDialogOpen(false);
                  setEditingService(null);
                }}
                serviceId= {editingService ? editingService.id :  undefined}
                initialValues = {editingService ? {
                  name: editingService.name,
                  price: (editingService.price / 100).toFixed(2).replace(".", ","),
                  hours: Math.floor(editingService.duration / 60).toString(),
                  minutes: (editingService.duration / 60).toString()
                }: undefined}
              />
            </DialogContent>
          </CardHeader>

          <CardContent>
            <section className="space-y-4 mt-5">
              {services.map((service) => (
                <article
                  className="flex items-center justify-between "
                  key={service.id}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-500">
                      {formatCurrency(service.price / 100)}
                    </span>
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleEditService(service)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir serviço</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o serviço "{service.name}"? 
                            Essa ação não poderá ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer"> Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteService(service.id)}
                            className="cursor-pointer"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </article>
              ))}
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  )
}
