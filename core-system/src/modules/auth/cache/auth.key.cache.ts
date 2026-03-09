

export const AuthCacheKey = {
    accessTokenKey: (kid: string) =>
        `cinebook:auth:jwt:key:access:${kid}`,

    refreshTokenKey: (kid: string) =>
        `cinebook:auth:jwt:key:refresh:${kid}`,

    currentAccessTokenKeyId : () => `cinebook:auth:jwt:key:current`,

    currentRefreshTokenKeyId : () => `cinebook:auth:jwt:key:current`,

    rotateLockKey: () => `cinebook:auth:jwt:rotate:lock`,
};