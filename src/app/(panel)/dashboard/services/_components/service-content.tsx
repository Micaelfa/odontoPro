import { canPermission } from "@/src/utils/permissions/canPermission";
import { getAllServices } from "../_data-access/get-all-services";
import { ServicesList } from "./service-list";
import { LabelSubscription } from "@/src/components/ui/label-subscription";

interface ServicesContentProps {
    userId: string;
}

export async function ServicesContent({userId}: ServicesContentProps) {
    
    const services = await getAllServices({userId: userId})
    const permissions = await canPermission({type:"service" })

    return (

        <>
            {!permissions.hasPermission && (
                <LabelSubscription expired={permissions.expired}/>
            )}
            <ServicesList services={services.data || []} permissions={permissions} />
        </>
    )
        
    
    
}