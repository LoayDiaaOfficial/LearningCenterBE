import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

export type AuthUser = { id: number; role: Role };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    return ctx.switchToHttp().getRequest().user;
  },
);
