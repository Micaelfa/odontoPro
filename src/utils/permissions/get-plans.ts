
import { Plan } from "@/src/generated/prisma/enums"
import { PlansProps } from "../plans"

export interface PlanDetailInfo{
    maxServices: number;
}

export const PLANS_LIMITS : PlansProps = {
    BASIC: {
        maxServices: 5,
    },
    PROFESSIONAL: {
        maxServices: 30,
    }
}

export async function getPlan(planId:Plan) {
    return PLANS_LIMITS[planId]
}