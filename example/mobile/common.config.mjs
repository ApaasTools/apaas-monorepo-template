import { loadEnv } from '@rsbuild/core'
import { fileURLToPath } from 'url'
import pkg from './package.json'

import { pluginVue2 } from '@rsbuild/plugin-vue2'
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginBabel } from '@rsbuild/plugin-babel'

import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export const resolve = (dir) => fileURLToPath(new URL(dir, import.meta.url))

/** 兼容环境变量 */
export const { publicVars } = loadEnv({ prefixes: ['VUE_APP_'] })
/** 入口文件 */
export const entry = process.env.PUBLIC_ENTRY || resolve('./src/main.js')
/** 构建输出名 */
export const outputName = process.env.PUBLIC_OUTPUT_NAME || 'dist'
/** 是否为 main.js 构建 */
export const isBuildDist = process.env.BUILD_TYPE === 'dist'
/** 是否为开发环境 */
export const isDev = process.env.NODE_ENV === 'development'

/**
 * @description 代理配置
 * @type {import('@rsbuild/core').RsbuildConfig['server']['proxy']}
 * @see https://rsbuild.dev/zh/config/server/proxy
 */
export const proxy = {
  // '/api': {
  //   target: 'http://172.16.90.67:7011', // server地址
  //   pathRewrite: {
  //     '^/api': ''
  //   }
  // }
}

/**
 * @description rsbuild 通用配置
 * @type {import('@rsbuild/core').RsbuildConfig}
 * @see https://rsbuild.dev/zh/config/
 */
export const rsbuildCommonConfig = {
  plugins: [
    pluginVue2(),
    pluginNodePolyfill(),
    pluginSass({
      sassLoaderOptions: {
        api: 'legacy',
        sassOptions: {
          // , 'mixed-decls'
          silenceDeprecations: ['legacy-js-api', 'import'],
          includePaths: [
            './node_modules/@x-apaas/x-dcloud-page-web/lib/theme-chalk/theme',
            './node_modules/@x-ui/x-dcloud-ui/lib/theme-chalk/theme',
            './node_modules/element-ui/packages/theme-chalk/src',
            './node_modules/element-ui/lib/theme-chalk'
          ]
        },
        additionalData: `
          @import "@/assets/scss/variable/index.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }),
    pluginBabel({
      babelLoaderOptions: {
        // 排除一些不需要被 babel 编译的文件，跳过 event 目录下所有 .js
        exclude: [/src[\\/]custom[\\/]common[\\/]event[\\/].*\.js$/],
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
              },
              useBuiltIns: 'usage',
              corejs: 3
            }
          ]
        ],
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              corejs: 3,
              helpers: true,
              regenerator: true,
              useESModules: false
            }
          ]
        ],
        overrides: [
          {
            test: [
              './src/components/input-code/identify-code/slide-block/index.vue',
              './src/custom/apaas-custom-crmCustomPage/custom-page/components/BaseSearchSort.vue',
              './src/assets/js/vuedraggable.js'
            ],
            plugins: ['@babel/plugin-transform-modules-commonjs']
          }
        ]
      }
    })
  ],
  source: {
    define: {
      BASE_URL: JSON.stringify('/'),
      ...publicVars
    },
    // 排除一些不需要编译的文件，跳过 event 目录下所有 .js 和 所有 zip 文件
    exclude: [/src[\\/]custom[\\/]common[\\/]event[\\/].*\.js$/, /\.zip$/],
    transformImport: [
      {
        libraryName: 'element-ui',
        libraryDirectory: 'lib',
        styleLibraryDirectory: 'lib/theme-chalk'
      },
      {
        libraryName: '@x-ui/x-dcloud-ui',
        libraryDirectory: 'lib',
        styleLibraryDirectory: 'lib/theme-chalk/theme'
      },
      {
        libraryName: '@x-apaas/x-dcloud-page-web',
        libraryDirectory: 'lib',
        styleLibraryDirectory: 'lib/theme-chalk/theme'
      }
    ]
  },
  html: {
    title: pkg.name,
    template: resolve('public/index.html')
  },
  dev: {
    progressBar: false
    // lazyCompilation: true
  },
  server: {
    port: 8081,
    publicDir: {
      copyOnBuild: false
    },
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    https: false,
    hotOnly: false,
    proxy
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      '~': resolve('src/custom/common'),
      vue$: 'vue/dist/vue.esm.js',
      lodash$: require.resolve('lodash'),
      canvas: require.resolve('empty-module')
    },
    extensions: ['.js', '.vue', '.json', '.css', '.scss']
  },
  tools: {
    bundlerChain: (chain) => {
      // 处理 .zip 为资源文件，import 返回 URL
      // chain.module
      //   .rule('zip')
      //   .test(/\.zip$/)
      //   .type('asset/resource')
      //   .generator({ filename: 'assets/zip/[name].[hash][ext]' })

      // chain.module
      //   .rule('css')
      //   .test(/\.css$/)
      //   .end()
      //   .use('postcss-loader')
      //   .loader('postcss-loader')
      //   .end()

      //  svg 处理， 对标得帆之前使用的 svg 方式
      chain.module.rules.delete('svg')
      chain.module
        .rule('svg')
        .test(/\.svg$/)
        .include.add([
          resolve('src/assets/icon'),
          resolve('src/lib/ui/assets/icon'),
          /@x-apaas\/x-dcloud-page-web\/lib\/assets\/icon/,
          /@x-ui\/x-dcloud-ui\/lib\/assets\/icon/,
          /x-dcloud-page-web[\\/]lib[\\/]assets[\\/]icon/,
          /x-dcloud-ui[\\/]lib[\\/]assets[\\/]icon/,
          /x-dcloud-page-mobile[\\/]lib[\\/]assets[\\/]icon/
        ])
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({ symbolId: 'svg-[name]' })
        .end()
        .use('svgo-loader')
        .loader('svgo-loader')
        .options({
          plugins: [
            'removeDoctype',
            'removeXMLProcInst',
            'removeComments',
            'removeMetadata',
            'removeTitle',
            'removeDesc',
            'removeUselessDefs',
            'removeEmptyAttrs'
          ]
        })
    },
    rspack: {
      resolveLoader: {
        alias: {
          // 修改内联 loader 中 worker-loader 的指向，如 `worker-loader!pdfjs-dist/es5/build/pdf.worker.js`
          'worker-loader': `${require.resolve('worker-rspack-loader')}?esModule=false`
        }
      },
      module: {
        rules: [
          {
            test: /\.worker\.js$/,
            use: {
              loader: require.resolve('worker-rspack-loader'),
              options: {
                inline: 'no-fallback'
              }
            }
          }
          // {
          //   test: /\.css$/,
          //   use: ['postcss-loader'],
          //   type: 'css'
          // }
        ]
      }
    },
    postcss: {
      postcssOptions: {
        plugins: [tailwindcss(), autoprefixer()]
      }
    }
  }
}
