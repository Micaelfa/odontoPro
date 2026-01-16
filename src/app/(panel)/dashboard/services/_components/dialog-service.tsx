"use client"

import { DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { DialogServiceFormData, useDialogServiceForm } from "./dialog-service-form"
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/src/components/ui/form"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { convertRealToCents } from "@/src/utils/convertCurrency"
import { createNewService } from "../_actions/create-service"
import { toast } from "sonner"
import { useState } from "react"
import { updateService } from "../_actions/update-service"



interface DialogServiceProps {
    closeModal: () => void;
    serviceId?: string;
    initialValues?: {
        name: string;
        price:string;
        hours: string;
        minutes: string;
    }
}

export function DialogService({closeModal, initialValues, serviceId} : DialogServiceProps){

    const form = useDialogServiceForm({initialValues: initialValues})
    const [loading, setLoading] = useState(false)



    async function onSubimit(values: DialogServiceFormData) {
    const priceInCents = convertRealToCents(values.price); // recebe "R$ 150,00"
    const hours = parseInt(values.hours) || 0;
    const minutes = parseInt(values.minutes) || 0;

    const duration = (hours * 60) + minutes;

    if(serviceId) {
        await editServiceById({
            serviceId: serviceId,
            name: values.name,
            priceInCents: priceInCents,
            duration: duration
        })

        return;

    }

    const response = await createNewService({
        name: values.name,
        price: priceInCents,
        duration,
    });

    if(response.error){
        toast.error(response.error)
        return;
    }

    toast.success("Serviço cadastrado com sucesso");

    handleCloseModal();
    }

    async function editServiceById({serviceId, name, priceInCents, duration } : {
        serviceId: string;
        name: string;
        priceInCents: number;
        duration: number;
    }) {

        const response = await updateService({
            serviceId: serviceId,
            name: name,
            price: priceInCents,
            duration: duration
        })
        
        setLoading(false);
        if(response.error) {
            toast(response.error)
            return;
        }
        toast(response.data)
        handleCloseModal();
    }

    function handleCloseModal() {
        form.reset();
        closeModal();

    }


// Máscara para input de valor, formatando valor (string)
function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
  let { value } = event.target;

  // mantém só dígitos
  value = value.replace(/\D/g, "");

  if (!value) {
    event.target.value = "";
    form.setValue("price", "", { shouldValidate: true });
    return;
  }

  // transforma centavos em reais
  value = (parseInt(value, 10) / 100).toFixed(2); // "150.00"
  value = value.replace(".", ",");                // "150,00"
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // "1.500,00"
  value = `R$ ${value}`;                          // "R$ 1.500,00"

  // mostra no input
  event.target.value = value;

  // salva no form como STRING (é o que o Zod espera)
  form.setValue("price", value, { shouldValidate: true });
}






    return(
        <>
            <DialogHeader>
                <DialogTitle>Novo Serviço</DialogTitle>
                <DialogDescription>
                    Adicione um novo serviço
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubimit)}
                    className="space-y-2"
                >
                    <div className="flex flex-col">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => {
                                return <FormItem>
                                    <FormLabel className="font-semibold">
                                        Nome do Serviço:    
                                    </FormLabel>
                                    <FormControl>

                                        <Input
                                            {...field}
                                            placeholder="Digite o nome do serviço..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }} 
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => {
                                return (
                                <FormItem className="my-2">
                                    <FormLabel className="font-semibold">
                                    Preço:
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Digite o preço do serviço..."
                                        onChange={changeCurrency} // 👈 já faz setValue por dentro
                            />    
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )
                            }} 
                        />

                    </div>

                      <p className="font-semibold">Tempo de duração do serviço</p>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="hours"
                            render={({field}) => {
                                return <FormItem className= 'my-2'>
                                    <FormLabel className="font-semibold"> 
                                        Horas:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="1" 
                                            min="0"
                                            type="number"
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }} 
                        />

                        <FormField
                            control={form.control}
                            name="minutes"
                            render={({field}) => {
                                return <FormItem className= 'my-2'>
                                    <FormLabel className="font-semibold"> 
                                        Minutos:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="0" 
                                            min="0"
                                            type="number"
                                            />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }} 
                        />
                    </div>

                    <Button className="w-full font-semibold text-white cursor-pointer" type="submit" disabled={loading}>
                        {loading ? "Carregando..." : `${serviceId? "atualizar" : "Cadastrar"}`}
                    </Button>

                </form>
                
            </Form>
        </>
    )

}