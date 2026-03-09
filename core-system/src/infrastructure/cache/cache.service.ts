import { Inject, Injectable, InternalServerErrorException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
    private client !: Redis;
    private isConnected: boolean = false;
    constructor(
        @Inject(LoggerService) private readonly logger : LoggerService,
        @Inject(ConfigService) private readonly configService : ConfigService
    ) {}
    async onModuleInit() {
        await this.connect()
    }

    async onModuleDestroy() {
        this.disconnect()
    }

    private async connect() {
        const options : RedisOptions = {
            host : this.configService.get('REDIS_HOST'),
            port : this.configService.get('REDIS_PORT'),
            username : this.configService.get('REDIS_USERNAME'),
            password : this.configService.get('REDIS_PASSWORD'),
            lazyConnect: true,
        }
        this.client = new Redis(options);

        this.registerEvents()
        try {

            await this.client.connect()

            const health = await this.client.ping();

            if (health !== 'PONG') {
                throw new Error('Redis connection error');
            }
            this.logger.log("redis connected");
        } catch (error) {
            this.logger.error("error connection redis");
            throw error
        }
    }


     private registerEvents(): void {
        this.client.on('ready', () => {
            this.isConnected = true;
            this.logger.log('Redis: sẵn sàng');
        });

        this.client.on('error', (error: Error) => {
            this.isConnected = false;
            this.logger.error(`Redis: lỗi - ${error.message}`);
        });

        this.client.on('reconnecting', () => {
            this.logger.warn('Redis: đang kết nối lại...');
        });

        this.client.on('end', () => {
            this.isConnected = false;
            this.logger.warn('Redis: kết nối đã đóng');
        });
    }

    private disconnect() {
        try{
            this.client.disconnect();
        }catch(error){
            this.logger.error("error disconnect redis");
            throw error
        }
    }

    async set(key: string, value: any,ttl?: number) {
        try{
            if(ttl) return this.client.set(key, JSON.stringify(value), 'EX', ttl)
            return await this.client.set(key, JSON.stringify(value));
        }catch(error){
            this.logger.error("error set redis");
            throw new Error("Server un available");
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const raw = await this.client.get(key);
            return raw ? JSON.parse(raw) as T : null;
        } catch (error) {
            this.logger.error("error get redis");
            throw new Error("Server unavailable");
        }
    }

    async del(key: string) {
        try{
            return await this.client.del(key);
        }catch(error){
            this.logger.error("error del redis");
            throw new Error("Server un available");
        }
    }
}
