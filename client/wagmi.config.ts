import { defineConfig } from '@wagmi/cli';
import { hardhat } from '@wagmi/cli/plugins';

export default defineConfig({
  out: 'src/config/contracts.ts',
  contracts: [],
  plugins: [
    hardhat({
      project: '../contracts',
      include: ['Hotel.json', 'Organisation.json', 'OrganisationFactory.json', 'Stablecoin.json'],
      deployments: {
        OrganisationFactory: '0x58bb99c193Fc8F30FbE5b27e3539003e1549d26d',
        Stablecoin: '0x518200E9F53BdEB9343170E960332AB5F48b0cFA',
      },
    }),
  ],
});
