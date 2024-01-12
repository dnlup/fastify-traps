import {
  FastifyPluginCallback,
} from 'fastify'

type FastifyTrapsPlugin = FastifyPluginCallback<fastifyTraps.FastifyTrapsOptions>

declare namespace fastifyTraps {

  export interface FastifyTrapsOptions {
    timeout?: number,
    onSignal?: (signal: 'SIGTERM' | 'SIGINT') => void,
    onClose?: () => void,
    onTimeout?: (timeout: number) => void,
    onError?: (error: Error|any) => void,
    strict?: boolean
  }

  export const fastifyTraps: FastifyTrapsPlugin
  export { fastifyTraps as default }
}

declare function fastifyTraps(
  ...params: Parameters<FastifyTrapsPlugin>
): ReturnType<FastifyTrapsPlugin>

export = fastifyTraps;
