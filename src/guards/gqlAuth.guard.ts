import type { ExecutionContext, Req } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): typeof Req {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req as typeof Req;
  }
}
