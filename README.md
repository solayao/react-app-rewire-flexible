Add the lib-flexible plugin to your create-react-app via react-app-rewired
---
# 参考资料
- https://go.ctolib.com/article/wiki/82279
- https://www.w3cplus.com/mobile/vw-layout-in-vue.html

---
```
const rewireFlexible = require('react-app-rewire-flexible');

module.exports = function override(config, env) {
    // ...
    config = rewireFlexible(config, env, [viewportWidth , viewportHeight, selectorBlackList]);
    // ...
    return config;
}
```
