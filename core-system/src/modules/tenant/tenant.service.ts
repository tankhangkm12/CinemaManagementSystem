import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantService {
    constructor(

    ){}

    async checkTenantExistById(id: string): Promise<any> {
        return true
    }
}
