import {
  FastifyPluginCallback,
  FastifyPluginAsync,
} from 'fastify'

export interface TrapsPluginOptions {
  timeout?: number,
  onSignal?: (signal: 'SIGTERM' | 'SIGINT') => {},
  onClose?: () => {},
  onTimeout?: (timeout: number) => {},
  onError?: (error: Error|any) => {},
  strict?: boolean
}

export const trapsPluginCallback: FastifyPluginCallback<TrapsPluginOptions>;
export const trapsPluginAsync: FastifyPluginAsync<TrapsPluginOptions>;

export default trapsPluginCallback;
