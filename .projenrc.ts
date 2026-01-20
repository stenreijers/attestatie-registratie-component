import { GemeenteNijmegenTsPackage } from '@gemeentenijmegen/projen-project-type';
import { Transform } from 'projen/lib/javascript';

const project = new GemeenteNijmegenTsPackage({
  defaultReleaseBranch: 'main',
  devDeps: ['@gemeentenijmegen/projen-project-type'],
  name: '@gemeentenijmegen/attestatie-registratie-component',
  projenrcTs: true,
  repository: 'https://github.com/GemeenteNijmegen/attestatie-registratie-component',
  npmTrustedPublishing: true,
  releaseWorkflowEnv: {
    VER_ID_GH_TOKEN: '${{ secrets.VER_ID_GH_TOKEN }}',
  },
  buildWorkflowOptions: {
    env: {
      VER_ID_GH_TOKEN: '${{ secrets.VER_ID_GH_TOKEN }}',
    },
  },
  deps: [
    '@ver-id/node-client',
    'dotenv',
    'jsonpath',
    '@types/jsonpath',
  ],
  jestOptions: {
    jestConfig: {
      roots: ['src', 'test'],
      setupFiles: ['dotenv/config'],
      extensionsToTreatAsEsm: ['.ts'],
      transformIgnorePatterns: [
        'node_modules/(?!@ver-id)',
      ],
      transform: {
        '^.+\\.tsx?$': new Transform('ts-jest', {
          useESM: true,
          tsconfig: {
            module: 'ESNext',
          },
        }),
      },
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
    },
  },
  tsconfig: {
    compilerOptions: {
      isolatedModules: true,
    },
  },
});
project.synth();