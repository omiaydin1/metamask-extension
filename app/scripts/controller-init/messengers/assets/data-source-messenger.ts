import type { ControllerMessenger } from '@metamask/base-controller';

// Actions that data sources need access to
type DataSourceAllowedActions =
  | { type: 'NetworkController:getState'; handler: () => unknown }
  | { type: 'NetworkController:getNetworkClientById'; handler: (id: string) => unknown }
  | { type: 'BackendWebSocketService:subscribe'; handler: (...args: unknown[]) => unknown }
  | { type: 'BackendWebSocketService:unsubscribe'; handler: (...args: unknown[]) => unknown }
  | { type: 'BackendWebSocketService:getState'; handler: () => unknown }
  | { type: 'BackendApiClient:AccountsApi:getMultiChainAccounts'; handler: (...args: unknown[]) => unknown }
  | { type: 'BackendApiClient:Tokens:getV3Assets'; handler: (...args: unknown[]) => unknown }
  | { type: 'BackendApiClient:Prices:getV3SpotPrices'; handler: (...args: unknown[]) => unknown }
  | { type: 'AssetsController:getState'; handler: () => unknown };

// Events that data sources need to subscribe to
type DataSourceAllowedEvents =
  | { type: 'NetworkController:stateChange'; payload: [unknown] }
  | { type: 'BackendWebSocketService:stateChange'; payload: [unknown] }
  | { type: 'AccountsApiDataSource:activeChainsChanged'; payload: [unknown] };

/**
 * Messenger type for DataSource initialization.
 * This messenger needs broad access since it creates child messengers internally.
 */
export type DataSourceMessenger = ControllerMessenger<
  DataSourceAllowedActions['type'],
  DataSourceAllowedEvents['type']
>;

/**
 * Get the messenger for DataSource initialization.
 *
 * The data sources use their own internal messenger hierarchy, so we return
 * the base messenger to allow them to create child messengers with proper
 * action/event delegation.
 *
 * @param baseMessenger - The base controller messenger
 * @returns The messenger for data source initialization
 */
export function getDataSourceMessenger(
  baseMessenger: ControllerMessenger<string, string>,
): DataSourceMessenger {
  // Return the base messenger - data sources will create their own child messengers
  // with proper delegation internally via initMessengers()
  return baseMessenger as DataSourceMessenger;
}

