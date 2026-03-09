import { Inject, Injectable } from "@nestjs/common";
import { CacheService } from "src/infrastructure/cache/cache.service";
import { AuthCacheKey } from "./auth.key.cache";

export abstract class AuthCacheRepository {

    abstract storeAccessTokenKey(kid: string, key: string, ttl: number): Promise<void>;
    abstract getAccessTokenKey(kid: string): Promise<string | null>;

    abstract getAccessCurrentKeyId(): Promise<string | null>;
    abstract setAccessCurrentKeyId(kid: string, ttl: number): Promise<void>;

    abstract acquireLock(): Promise<boolean>;
    abstract releaseLock(): Promise<void>;
}

@Injectable()
export class RedisAuthCacheRepository extends AuthCacheRepository {

    constructor(
        @Inject(CacheService)
        private readonly cacheService: CacheService
    ) {
        super();
    }

    async storeAccessTokenKey(kid: string, key: string, ttl: number): Promise<void> {
        await this.cacheService.set(AuthCacheKey.accessTokenKey(kid), key, ttl);
    }

    async getAccessTokenKey(kid: string): Promise<string | null> {
        return this.cacheService.get(AuthCacheKey.accessTokenKey(kid));
    }

    async getAccessCurrentKeyId(): Promise<string | null> {
        return this.cacheService.get(AuthCacheKey.currentAccessTokenKeyId());
    }

    async setAccessCurrentKeyId(kid: string, ttl: number): Promise<void> {
        await this.cacheService.set(AuthCacheKey.currentAccessTokenKeyId(), kid, ttl);
    }

    async acquireLock(): Promise<boolean> {
        const result = await this.cacheService.set(AuthCacheKey.rotateLockKey(), '1', 30);

        if (result === "OK") return true;

        return false;
    }

    async releaseLock(): Promise<void> {
        await this.cacheService.del(AuthCacheKey.rotateLockKey());
    }
}