import { Public, Roles } from "@common/decorator";
import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RolseGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        let request: any;
        if (context.getType() === 'ws') {
            const client = context.switchToWs().getClient();
            request = client.data;
        } else {
            request = context.switchToHttp().getRequest();
        }
        const roles = this.reflector.getAllAndMerge(Roles, [context.getHandler(), context.getClass()])
        const publicValue = this.reflector.get(Public, context.getHandler())
        if (publicValue) {
            return true
        }
        if (!roles.includes(request.user.role)) {
            
            throw new UnauthorizedException('not allowed')
        }

        return true

    }
}