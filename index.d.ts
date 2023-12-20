import {
  FastifyPluginCallback,
} from 'fastify-plugin'

export interface TrapsPluginOptions {
  timeout?: number,
  onSignal?: (signal: 'SIGTERM' | 'SIGINT') => void,
  onClose?: () => void,
  onTimeout?: (timeout: number) => void,
  onError?: (error: Error|any) => void,
  strict?: boolean
}

const plugin: FastifyPluginCallback<TrapsPluginOptions>;
export = plugin;
