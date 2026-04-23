
import { AuthGuard, RolseGuard } from '@common/guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator.js';

export function Auth(roles: string[]) {
    return applyDecorators(
        Roles(roles),
        UseGuards(AuthGuard, RolseGuard),
    );
}
