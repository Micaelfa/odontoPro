"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form"
import { ReminderFormData, useReminedrForm } from "./reminder.form"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import { createReminder } from "../../_actions/create-reminder"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


interface ReminderContentProps{
    closeDialog: () => void;
}

export function ReminderContent({closeDialog} : ReminderContentProps) {
    
    const form = useReminedrForm()
    const router = useRouter()

    async function onSubmit(formData: ReminderFormData) {
        const response = await createReminder({description: formData.description})

        if(response.error){
            toast.error(response.error)
            return;
        }

        toast.success(response.data)
        router.refresh();
        closeDialog();

    }

    return (
        <div className="grid gap-4 py-4">
            <Form {...form}>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="font-semibold">Descreva o lembrete:</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Digite o nome do lembrete..."
                                        className="max-h-52"


                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button 
                        disabled={!form.watch("description")}
                        type="submit"
                        className="cursor-pointer"
                    >
                        Cadastrar lembretes
                    </Button>
                </form>
            </Form>

            
        </div>
    )
}