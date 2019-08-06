Add the lib-flexible plugin to your create-react-app via react-app-rewired
---
# 参考资料
- https://www.jianshu.com/p/1d913261d56f

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
