
export type PlanDetailsProps = {
    maxServices: number;
}

export type PlansProps = {
    BASIC: PlanDetailsProps;
    PROFESSIONAL: PlanDetailsProps;
}

export const PLANS : PlansProps = {
    BASIC: {
        maxServices: 5,
    },
    PROFESSIONAL: {
        maxServices: 30,
    }
}

export const subscriptionPlans = [
    {
        id: "BASIC",
        name: "Basic",
        desciption: "Perfeito para clinicas menores",
        oldPrice: "R$ 97,90",
        price: "R$ 27,90",
        features: [
            `Até ${PLANS["BASIC"].maxServices} serviços.`,
            `Agendamentos ilimitados`,
            `Suporte`,
            `Relatórios`,
        ]
    },

    {
        id: "PROFESSIONAL",
        name: "Professional",
        desciption: "Ideal para clinicas grandes",
        oldPrice: "R$ 197,90",
        price: "R$ 87,90",
        features: [
            `Até ${PLANS["PROFESSIONAL"].maxServices} serviços.`,
            `Agendamentos ilimitados`,
            `Suporte prioritário`,
            `Analytics de dados`        
        ]
    }

]