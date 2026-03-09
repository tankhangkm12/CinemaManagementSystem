import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { randomBytes } from 'crypto';
import { AuthCacheRepository } from './cache/auth.cache.repository';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class KeyService implements OnModuleInit {

    private currentAccessKey!: string;
    private currentAccessKid!: string;

    private keyCache = new Map<string, string>();

    private readonly KEY_TTL = 60 * 60 + 15 * 60 + 5 * 60; // 1h20m

    constructor(
        @Inject(AuthCacheRepository)
        private readonly authCacheRepository: AuthCacheRepository,

        @Inject(LoggerService)
        private readonly logger: LoggerService
    ) {}

    async onModuleInit() {
        const currentKid = await this.authCacheRepository.getAccessCurrentKeyId();
    
        if (currentKid) {
            console.log({currentKid})
            await this.syncKeys(); // có rồi → load lên memory thôi
        } else {
            await this.rotateKeys(); // chưa có → lần đầu chạy
        }
    }

    private generateKey(): string {
        return randomBytes(64).toString('hex');
    }

    private generateKid(): string {
        return `key_${Date.now()}`;
    }

    @Cron('0 * * * *')
    async rotateKeys() {
        const lock = await this.authCacheRepository.acquireLock();
        if (!lock) {
            await new Promise(r => setTimeout(r, 1000));
            await this.syncKeys();
            return;
        }

        try {
            this.currentAccessKey = this.generateKey();
            this.currentAccessKid = this.generateKid();

            await Promise.all([
                this.authCacheRepository.storeAccessTokenKey(this.currentAccessKid, this.currentAccessKey, this.KEY_TTL),
                this.authCacheRepository.setAccessCurrentKeyId(this.currentAccessKid, this.KEY_TTL),
            ]);

            this.keyCache.set(this.currentAccessKid, this.currentAccessKey);
            this.logger.log(`JWT keys rotated → ${this.currentAccessKid}`);
        } catch (error: any) {
            this.logger.error('Failed to rotate keys: ', error.message);
        } finally {
            await this.authCacheRepository.releaseLock();
        }
    }

    async syncKeys() {
        const currentKid = await this.authCacheRepository.getAccessCurrentKeyId();

        if (!currentKid || currentKid === this.currentAccessKid) return;

        const key = await this.authCacheRepository.getAccessTokenKey(currentKid);
        if (!key) return;

        this.currentAccessKey = key;
        this.currentAccessKid = currentKid;
        this.keyCache.set(currentKid, key);

        this.logger.log(`Keys synced → ${currentKid}`);
    }

    async getAccessSigningKey(): Promise<{ key: string; kid: string }> {
        if (!this.currentAccessKey || !this.currentAccessKid) {
            console.log("get key from redis")
            await this.syncKeys();
        }
        return { key: this.currentAccessKey, kid: this.currentAccessKid };
    }

    async getAccessKeyByKid(kid: string): Promise<string | null> {
        if (this.keyCache.has(kid)) return this.keyCache.get(kid)!;
        console.log("get key from redis")
        const key = await this.authCacheRepository.getAccessTokenKey(kid);
        if (key) this.keyCache.set(kid, key);
        return key;
    }
}