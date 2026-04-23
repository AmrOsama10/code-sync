import { Public } from "@common/decorator/public.decorator";
import { UserRepository } from "@models/index";
import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const { authorization } = request.headers;

            const publicValue = this.reflector.get(Public, context.getHandler())
            if (publicValue) {
                return true
            }

            const payload = await this.jwtService.verifyAsync<{ id: string; email: string }>(authorization, {
                secret: this.configService.get('jwt').accessSecret,
            });

            const userExist = await this.userRepository.getOne({ _id: payload.id }); 
            
            if (!userExist) {
                throw new NotFoundException('User not found');
            }
            
            request.user = userExist;
            return true;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}