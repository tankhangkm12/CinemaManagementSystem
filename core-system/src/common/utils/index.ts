import { AdvantageFeature } from "src/modules/plan/plan.enum";

export const checkAdvantageFeturesExist = (
    features: [string]
) => {
    console.log({features})
    console.log({len : features.length})
    if (!features.length) return false;
    const advantage_features = Object.values(AdvantageFeature) as string[]
    console.log({advantage_features})
    return features.every(feature => advantage_features.includes(feature))
}