import { BackendApiClient } from '@metamask/core-backend';
import { ControllerInitFunction } from '../types';
import {
  BackendApiClientMessenger,
  BackendApiClientInitMessenger,
} from '../messengers/core-backend';

/**
 * Initialize the BackendApiClient.
 *
 * BackendApiClient provides a unified SDK for MetaMask's internal APIs:
 * - Accounts API (balances, transactions, relationships)
 * - Token API (token metadata, trending tokens)
 * - Tokens API (CAIP-19 assets, search)
 * - Price API (token prices, exchange rates)
 *
 * All API methods are exposed via the Messenger for other controllers to call:
 * - BackendApiClient:Accounts:*
 * - BackendApiClient:Token:*
 * - BackendApiClient:Tokens:*
 * - BackendApiClient:Prices:*
 */
export const BackendApiClientInit: ControllerInitFunction<
  BackendApiClient,
  BackendApiClientMessenger,
  BackendApiClientInitMessenger
> = ({ controllerMessenger, initMessenger }) => {
  const client = new BackendApiClient({
    clientProduct: 'metamask-extension',
    getBearerToken: async () => {
      try {
        return await initMessenger.call(
          'AuthenticationController:getBearerToken',
        );
      } catch {
        // User not signed in
        return undefined;
      }
    },
    messenger: controllerMessenger,
  });

  return {
    controller: client,
    // BackendApiClient has no state to persist or sync
    persistedStateKey: null,
    memStateKey: null,
  };
};

