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
        OrganisationFactory: '0x042c5bF7C2174941C550D93bd2F388f453AF07B2',
        Stablecoin: '0x518200E9F53BdEB9343170E960332AB5F48b0cFA',
      },
    }),
  ],
});
