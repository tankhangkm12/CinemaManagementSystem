// create-permission.dto.ts
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EnumActionPermission, EnumResourcePermission } from "../enum";

export class CreatePermissionDto {
    @IsString()
    @IsOptional()
    code ?: string = undefined;

    @IsEnum(EnumResourcePermission)
    @IsNotEmpty()
    resource !: EnumResourcePermission;

    @IsEnum(EnumActionPermission)
    @IsNotEmpty()
    action !: EnumActionPermission;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean = true;
}