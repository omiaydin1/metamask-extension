import type { BackendApiClientMessenger as CoreBackendApiClientMessenger } from '@metamask/core-backend';
import { Messenger } from '@metamask/messenger';
import { AuthenticationControllerGetBearerToken } from '@metamask/profile-sync-controller/auth';
import { RootMessenger } from '../../../lib/messenger';

export type BackendApiClientMessenger = CoreBackendApiClientMessenger;

/**
 * Actions that BackendApiClient can call during initialization
 */
type AllowedInitializationActions = AuthenticationControllerGetBearerToken;

export type BackendApiClientInitMessenger = ReturnType<
  typeof getBackendApiClientInitMessenger
>;

/**
 * Get an initialization messenger for BackendApiClient.
 * This provides access to authentication for API calls.
 *
 * @param messenger - The root controller messenger.
 * @returns The initialization messenger for BackendApiClient.
 */
export function getBackendApiClientInitMessenger(
  messenger: RootMessenger<AllowedInitializationActions, never>,
) {
  const initMessenger = new Messenger<
    'BackendApiClientInit',
    AllowedInitializationActions,
    never,
    typeof messenger
  >({
    namespace: 'BackendApiClientInit',
    parent: messenger,
  });

  messenger.delegate({
    messenger: initMessenger,
    actions: ['AuthenticationController:getBearerToken'],
  });

  return initMessenger;
}

/**
 * Get a restricted messenger for BackendApiClient.
 * This exposes the BackendApiClient actions to other controllers.
 *
 * @param messenger - The root controller messenger.
 * @returns The restricted messenger for BackendApiClient.
 */
export function getBackendApiClientMessenger(
  messenger: RootMessenger<never, never>,
): CoreBackendApiClientMessenger {
  const serviceMessenger = new Messenger<
    'BackendApiClient',
    never,
    never,
    typeof messenger
  >({
    namespace: 'BackendApiClient',
    parent: messenger,
  });

  return serviceMessenger as unknown as CoreBackendApiClientMessenger;
}

