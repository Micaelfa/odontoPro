import { Star } from "lucide-react";

export function PremiumCardBadge(){
    return(
        <div className="absolute top-0 right-0 bg-yellow-500 w-12 h-12 z-2 rounded-full flex items-center justify-center">
            <Star className="text-white"/>
        </div>
    )
}