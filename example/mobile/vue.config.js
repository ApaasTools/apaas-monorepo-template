/*
 * @Author: your name
 * @Date: 2020-07-23 17:45:00
 * @LastEditTime: 2021-07-08 20:21:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xdap-h5\vue.config.js
 */
const path = require('path') // 引入path模块

const isProd = () => {
  return process.env.NODE_ENV === 'production'
}

function resolve(dir) {
  return path.join(__dirname, dir) // path.join(__dirname)设置绝对路径
}
module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  assetsDir: 'public',
  lintOnSave: isProd(),
  transpileDependencies: [
    /.*@x-apaas\/x-lib-rule-engine.*/,
    '@x-apaas/x-lib-rule-engine',
    '@ampproject/remapping',
    '@jridgewell/gen-mapping',
    '@jridgewell/trace-mapping',
    /node_modules\/.pnpm\/@ampproject/,
    /node_modules\/.pnpm\/@jridgewell/
  ],
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: ['./src/theme']
      },
      sass: {
        prependData: `
          @import "@/assets/scss/variable/index.scss";
          @import "@/assets/scss/mixin.scss";
        `,
        // 去除了 node-sass，升级为 sass 后忽略一些使用废弃 api 的警告
        sassOptions: {
          quietDeps: true, // 忽略依赖项中的警告
          logger: {
            warn: function() {
              // 完全忽略所有警告
              return ''
            }
          }
        }
      },
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')]
      }
    }
  },
  // devServer: {
  //   open: process.platform === 'darwin',
  //   host: '0.0.0.0',
  //   port: '8080',
  //   disableHostCheck: true,
  //   https: false,
  //   hotOnly: false,
  //   overlay: {
  //     warnings: false,
  //     errors: true
  //   }
  //   // proxy: {
  //   //   '/api': {
  //   //     target: 'http://portal.definesys.com:30502',
  //   //     changeOrigin: true,
  //   //     pathRewrite: {
  //   //       '^/api': '/'
  //   //     }
  //   //   }
  //   // }
  // },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },
  configureWebpack: () => ({
    name: 'vue-cli3-template',
    resolve: {
      alias: {
        // vue动态值
        vue$: 'vue/dist/vue.esm.js',

        // vue快速路径
        '@': resolve('src')
      },
      mainFields: ['browser', 'module', 'main'],
      extensions: ['.js', '.vue', '.json', '.mjs']
    },
    plugins: [],
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
        // {
        //   test: /\.svg$/,
        //   oneOf: [
        //     {
        //       include: [
        //         path.resolve('./src/assets/icon'),
        //         path.resolve('./src/lib/ui/assets/icon'),
        //         path.resolve('../x-dcloud-page-mobile/lib/assets/icon'),
        //         path.resolve('../../XUI/x-dcloud-page-mobile/lib/assets/icon'),
        //         path.resolve(
        //           './node_modules/_@x-apaas_x-dcloud-page-mobile@0.3.3@@x-apaas/x-dcloud-page-mobile/lib/assets/icon'
        //         ),
        //         path.resolve(
        //           './node_modules/_@x-apaas_x-dcloud-page-mobile@0.2.0-rc.0@@x-apaas/x-dcloud-page-mobile/lib/assets/icon'
        //         )
        //       ],
        //       use: [
        //         {
        //           loader: 'svg-sprite-loader',
        //           options: {
        //             symbolId: 'svg-[name]'
        //           }
        //         }
        //       ]
        //     },
        //     {
        //       use: [
        //         {
        //           loader: 'svg-inline-loader'
        //         }
        //       ]
        //     }
        //   ]
        // }
      ],
      noParse: [
        /node_modules\/.pnpm\/@ampproject\/remapping@2.3.0/,
        /node_modules\/.pnpm\/@jridgewell\/gen-mapping@0.3.8/,
        /node_modules\/.pnpm\/@jridgewell\/trace-mapping@0.3.25/
      ]
    }
  }),
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('./src')).set('components', resolve('./src/components'))

    // 正确配置 SVG 加载
    const svgRule = config.module.rule('svg')
    // 清除已有的所有 loader
    svgRule.uses.clear()

    // 配置两种处理方式
    svgRule
      .oneOf('inline')
      .test(/\.svg$/)
      .include.add(resolve('./src/assets/icon'))
      .add(resolve('./src/lib/ui/assets/icon'))
      .add(resolve('../x-dcloud-page-mobile/lib/assets/icon'))
      .add(resolve('../../XUI/x-dcloud-page-mobile/lib/assets/icon'))
      .add(
        resolve(
          './node_modules/_@x-apaas_x-dcloud-page-mobile@0.3.3@@x-apaas/x-dcloud-page-mobile/lib/assets/icon'
        )
      )
      .add(
        resolve(
          './node_modules/_@x-apaas_x-dcloud-page-mobile@0.2.0-rc.0@@x-apaas/x-dcloud-page-mobile/lib/assets/icon'
        )
      )
      .add(resolve('./node_modules/@x-apaas/x-dcloud-page-mobile/lib/assets/icon'))
      .end()
      .use('vue-svg-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'svg-[name]'
      })
      .end()
      .end()
      .oneOf('external')
      .test(/\.svg$/)
      .use('svg-url-loader')
      .loader('file-loader')
      .options({
        name: 'public/img/[name].[hash:8].[ext]'
      })
      .end()
  }
}
