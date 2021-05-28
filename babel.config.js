/* eslint-disable */

module.exports = api => {
  const validEnv = ['development', 'test', 'production'];
  const currentEnv = api.env();
  const isDevelopmentEnv = api.env('development');
  const isProductionEnv = api.env('production');
  const isTestEnv = api.env('test');

  if (!validEnv.includes(currentEnv)) {
    throw new Error(
      `Please specify a valid 'NODE_ENV' or 'BABEL_ENV' environment variables. Valid values are "development", "test", and "production". Instead, received: ${JSON.stringify(
        currentEnv
      )}.`
    );
  }

  return {
    presets: [
      isTestEnv && [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
          modules: 'commonjs',
        },
        '@babel/preset-react',
      ],
      isTestEnv && ['@babel/preset-typescript'],
      (isProductionEnv || isDevelopmentEnv) && [
        '@babel/preset-env',
        {
          forceAllTransforms: true,
          useBuiltIns: 'entry',
          corejs: 3,
          modules: false,
          exclude: ['transform-typeof-symbol'],
        },
      ],
      [
        '@babel/preset-react',
        {
          development: isDevelopmentEnv || isTestEnv,
          useBuiltIns: true,
        },
      ],
    ].filter(Boolean),
    plugins: [
      'lodash',
      'babel-plugin-macros',
      '@babel/plugin-syntax-dynamic-import',
      isTestEnv && 'babel-plugin-dynamic-import-node',
      '@babel/plugin-transform-destructuring',
      [
        '@babel/plugin-proposal-class-properties',
        {
          loose: true,
        },
      ],
      [
        '@babel/plugin-proposal-object-rest-spread',
        {
          useBuiltIns: true,
        },
      ],
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false,
          regenerator: true,
          corejs: false,
        },
      ],
      [
        '@babel/plugin-transform-regenerator',
        {
          async: false,
        },
      ],
      [
        'transform-imports', {
          '@fortawesome/pro-light-svg-icons': {
            'transform': '@fortawesome/pro-light-svg-icons/${member}',
            'skipDefaultConversion': true,
            'preventFullImport': true,
          },
          '@fortawesome/free-solid-svg-icons': {
            'transform': '@fortawesome/free-solid-svg-icons/${member}',
            'skipDefaultConversion': true,
            'preventFullImport': true,
          },
          'lodash': {
            'transform': 'lodash/${member}',
            'preventFullImport': true,
          }
        }
      ],
      isProductionEnv && [
        'babel-plugin-transform-react-remove-prop-types',
        {
          removeImport: true,
        },
      ],
    ].filter(Boolean),
  };
};
