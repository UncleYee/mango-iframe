const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require("@craco/craco");

module.exports = {
  reactScriptsVersion: "react-scripts" /* (default value) */,
  style: {
    postcss: {
      mode: "extends" /* (default value) */ || "file",
      plugins: [
        require('postcss-px-to-viewport')({
          viewportWidth: 750, // 设计稿宽度
          viewportHeight: 1334, // 设计稿高度，可以不指定
          unitPrecision: 3, // px to vw无法整除时，保留几位小数
          viewportUnit: 'vw', // 转换成vw单位
          selectorBlackList: ['.ignore', '.hairlines'], // 不转换的类名
          minPixelValue: 1, // 小于1px不转换
          mediaQuery: false // 允许媒体查询中转换
        }),
      ],
      env: {
          autoprefixer: { /* Any autoprefixer options: https://github.com/postcss/autoprefixer#options */ },
          stage: 3, /* Any valid stages: https://cssdb.org/#staging-process. */
          features: { /* Any CSS features: https://preset-env.cssdb.org/features. */ }
      },
      loaderOptions: { /* Any postcss-loader configuration options: https://github.com/postcss/postcss-loader. */ },
    }
  },
};