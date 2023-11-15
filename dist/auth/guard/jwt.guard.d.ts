import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private config;
    private reflector;
    constructor(jwtService: JwtService, config: ConfigService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
