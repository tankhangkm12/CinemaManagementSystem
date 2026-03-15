import { AdvantageFeature } from "src/modules/plan/plan.enum";
import * as bcrypt from 'bcrypt'
import slugify from 'slugify'
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

export const hash = async (password : string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const compare = async (password : string, hashedPassword : string) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const  createSlug = (name : string) => {
    const slug = slugify(
        name,
        {
            lower: true,
            strict: true,
            trim: true
        }
    )

    return slug
}
