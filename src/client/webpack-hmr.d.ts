/**
 * Type declarations for Webpack Hot Module Replacement
 */

interface WebpackHotModule {
  hot?: {
    accept(path: string, callback: () => void): void;
  };
}

declare const module: WebpackHotModule;
