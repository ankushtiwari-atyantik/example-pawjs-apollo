export default class ProjectWebpack {
  apply(webpackHandler) {
    webpackHandler.hooks.beforeConfig.tap('mjsSolver', (env, type, config) => {
      try {
        let conf = config;

        if (!Array.isArray(config)) {
          conf = [config];
        }
        conf.forEach((c) => {
          const moduleRules = c.module.rules;
          moduleRules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: "javascript/auto",
          });
          return moduleRules;

        });
      } catch (ex) {
        // eslint-disable-next-line
        console.log(ex);
      }
    });
  }
}
