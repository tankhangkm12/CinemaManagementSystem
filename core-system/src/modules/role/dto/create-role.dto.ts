// create-role.dto.ts
import { ArrayMinSize, IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Types } from "mongoose";

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    code !: string;

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    permissions_codes !: string[];

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    permissions_ids ?: Types.ObjectId[] = undefined;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean = true;
}