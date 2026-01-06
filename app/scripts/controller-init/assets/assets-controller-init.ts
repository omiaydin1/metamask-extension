import {
  AssetsController,
  getDefaultAssetsControllerState,
} from '@metamask/assets-controllers';
import { AssetsControllerMessenger } from '../messengers/assets';
import { ControllerInitFunction } from '../types';

/**
 * Initialize the AssetsController.
 *
 * The AssetsController manages asset data (balances, metadata, prices) across
 * multiple chains using a flexible data source architecture.
 */
export const AssetsControllerInit: ControllerInitFunction<
  AssetsController,
  AssetsControllerMessenger
> = ({ controllerMessenger, persistedState }) => {
  const controller = new AssetsController({
    messenger: controllerMessenger,
    state: {
      ...getDefaultAssetsControllerState(),
      ...persistedState.AssetsController,
    },
    // Enable automatic metadata enrichment for assets missing metadata
    // Uses BackendApiClient:Tokens:getV3Assets to fetch token details
    enableMetadataEnrichment: true,
  });

  return {
    controller,
  };
};




