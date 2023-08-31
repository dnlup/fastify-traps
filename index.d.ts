import {
  FastifyPluginCallback,
  FastifyPluginAsync,
} from 'fastify'

export interface TrapsPluginOptions {
  timeout?: number,
  onSignal?: (signal: 'SIGTERM' | 'SIGINT') => void,
  onClose?: () => void,
  onTimeout?: (timeout: number) => void,
  onError?: (error: Error|any) => void,
  strict?: boolean
}

export const trapsPluginCallback: FastifyPluginCallback<TrapsPluginOptions>;
export const trapsPluginAsync: FastifyPluginAsync<TrapsPluginOptions>;

export default trapsPluginCallback;
