import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
    log(message: string, context?: string) {
        console.log(`[LOG] [${context ?? 'App'}] ${message}`);
    }

    error(message: string, trace?: string, context?: string) {
        console.error(`[ERROR] [${context ?? 'App'}] ${message}`, trace);
    }

    warn(message: string, context?: string) {
        console.warn(`[WARN] [${context ?? 'App'}] ${message}`);
    }

    debug(message: string, context?: string) {
        console.debug(`[DEBUG] [${context ?? 'App'}] ${message}`);
    }
}
