import { SetMetadata } from "@nestjs/common";

export const IS_REQUIRED_PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (
    ...permissions: string[]
) => SetMetadata(IS_REQUIRED_PERMISSIONS_KEY, permissions);


export const IS_PUBLIC = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC, true);