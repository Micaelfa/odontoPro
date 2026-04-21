import { getAllServices } from "../_data-access/get-all-services";
import { ServicesList } from "./service-list";

interface ServicesContentProps {
    userId: string;
}

const delay = (ms:number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export async function ServicesContent({userId}: ServicesContentProps) {
    
    await delay(5000);
    const services = await getAllServices({userId: userId})

    return (
        <ServicesList services={services.data || []} />
    )
        
    
    
}