import { Messenger } from '@metamask/messenger';
import {
  AccountTreeControllerGetAccountsFromSelectedAccountGroupAction,
  AccountTreeControllerSelectedAccountGroupChangeEvent,
} from '@metamask/account-tree-controller';
import type {
  TokensGetV3AssetsAction,
  PricesGetV3SpotPricesAction,
} from '@metamask/core-backend';
import {
  KeyringControllerLockEvent,
  KeyringControllerUnlockEvent,
} from '@metamask/keyring-controller';
import {
  NetworkEnablementControllerGetStateAction,
  NetworkEnablementControllerEvents,
} from '@metamask/network-enablement-controller';
import type {
  // Data source action union types
  AccountsApiDataSourceActions,
  SnapDataSourceActions,
  RpcDataSourceActions,
  // Enrichment middleware action union types
  TokenDataSourceActions,
  DetectionMiddlewareActions,
  PriceDataSourceActions,
} from '@metamask/assets-controllers';
import { RootMessenger } from '../../../lib/messenger';

/**
 * App lifecycle event: fired when app becomes active (opened/foregrounded)
 */
type AppStateControllerAppOpenedEvent = {
  type: 'AppStateController:appOpened';
  payload: [];
};

/**
 * App lifecycle event: fired when app becomes inactive (closed/backgrounded)
 */
type AppStateControllerAppClosedEvent = {
  type: 'AppStateController:appClosed';
  payload: [];
};

/**
 * The actions that the AssetsController messenger requires.
 *
 * Note: Data sources now CALL AssetsController:activeChainsUpdate and
 * AssetsController:assetsUpdate actions to report updates, rather than
 * the controller subscribing to data source events.
 */
type Actions =
  | AccountTreeControllerGetAccountsFromSelectedAccountGroupAction
  | NetworkEnablementControllerGetStateAction
  // Backend API actions
  | TokensGetV3AssetsAction
  | PricesGetV3SpotPricesAction
  // Data source middleware actions (for fetch pipeline)
  | AccountsApiDataSourceActions
  | SnapDataSourceActions
  | RpcDataSourceActions
  // Enrichment middleware actions
  | TokenDataSourceActions
  | DetectionMiddlewareActions
  | PriceDataSourceActions;

/**
 * The events that the AssetsController messenger requires.
 *
 * Note: AssetsController does NOT subscribe to data source events.
 * Data sources call AssetsController actions directly to report updates.
 */
type Events =
  | AccountTreeControllerSelectedAccountGroupChangeEvent
  | NetworkEnablementControllerEvents
  | KeyringControllerLockEvent
  | KeyringControllerUnlockEvent
  | AppStateControllerAppOpenedEvent
  | AppStateControllerAppClosedEvent;

export type AssetsControllerMessenger = ReturnType<
  typeof getAssetsControllerMessenger
>;

/**
 * Create a messenger restricted to the allowed actions and events of the
 * AssetsController.
 *
 * @param messenger - The base messenger used to create the restricted messenger.
 * @returns The restricted messenger for AssetsController.
 */
export function getAssetsControllerMessenger(
  messenger: RootMessenger<Actions, Events>,
) {
  const controllerMessenger = new Messenger<
    'AssetsController',
    Actions,
    Events,
    typeof messenger
  >({
    namespace: 'AssetsController',
    parent: messenger,
  });

  messenger.delegate({
    messenger: controllerMessenger,
    actions: [
      'AccountTreeController:getAccountsFromSelectedAccountGroup',
      'NetworkEnablementController:getState',
      // Backend API actions
      'BackendApiClient:Tokens:getV3Assets',
      'BackendApiClient:Prices:getV3SpotPrices',
      // Data source middleware actions (for fetch pipeline)
      'AccountsApiDataSource:getAssetsMiddleware',
      'SnapDataSource:getAssetsMiddleware',
      'RpcDataSource:getAssetsMiddleware',
      // Enrichment middleware actions
      'TokenDataSource:getAssetsMiddleware',
      'DetectionMiddleware:getAssetsMiddleware',
      'PriceDataSource:getAssetsMiddleware',
      'PriceDataSource:fetch',
      'PriceDataSource:subscribe',
      'PriceDataSource:unsubscribe',
    ],
    events: [
      'AccountTreeController:selectedAccountGroupChange',
      'NetworkEnablementController:stateChange',
      'KeyringController:lock',
      'KeyringController:unlock',
      // App lifecycle events
      'AppStateController:appOpened',
      'AppStateController:appClosed',
    ],
  });

  return controllerMessenger;
}
