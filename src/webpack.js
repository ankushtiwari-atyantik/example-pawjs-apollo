import path from 'path';

export default class ProjectWebpack {
  apply(webpackHandler) {
    webpackHandler.hooks.beforeConfig.tap('mjsSolver', (env, type, config) => {
      try {
        let conf = config;

        if (!Array.isArray(config)) {
          conf = [config];
        }
        conf.forEach((c) => {
          c.resolve = c.resolve ? JSON.parse(JSON.stringify(c.resolve)) : {};
          if (type === "server") {
            c.resolve.mainFields = ['main', 'module'];
            c.resolve.extensions = ['.js', '.wasm', '.mjs', '.json'];
          } else if (type === "web" ){
            c.resolve.mainFields = ['browser', 'main', 'module'];
            c.resolve.extensions = ['.js', '.wasm', '.mjs', '.json'];
          }
        });
      } catch (ex) {
        // eslint-disable-next-line
        console.log(ex);
      }
    });
  }
}
