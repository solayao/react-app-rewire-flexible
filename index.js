const ruleChildren = (loader) => loader.use || loader.oneOf || Array.isArray(loader.loader) && loader.loader || [];

const findIndexAndRules = (rulesSource, ruleMatcher) => {
    let result = undefined;
    const rules = Array.isArray(rulesSource) ? rulesSource : ruleChildren(rulesSource);
    rules.some((rule, index) => result = ruleMatcher(rule) ? {index, rules} : findIndexAndRules(ruleChildren(rule), ruleMatcher));
    return result;
}

const findRule = (rulesSource, ruleMatcher) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher);
    return rules[index];
}

const createLoaderMatcher = (loader) => (rule) => rule.loader && rule.loader.indexOf(`${loader}`) !== -1;
const postcssLoaderMatcher = createLoaderMatcher('postcss-loader');


/**
 * export the func
 * @param {*} config config of react-app-rewire throw
 * @param {*} env env of react-app-rewire throw
 * @param {number} [viewportWidth=750] (Number) The width of the viewport. 
 * @param {number} [viewportHeight=1334] (Number) The height of the viewport. 
 * @param {string} [selectorBlackList=['.ignore', '.hairlines']] (Array) The selectors to ignore and leave as px.
 * @returns {*} config
 */
module.exports = function (config, env, viewportWidth = 750, viewportHeight = 1334, selectorBlackList = ['.ignore', '.hairlines']) {
  const postcssLoader = findRule(config.module.rules, postcssLoaderMatcher);
  const oldPostcssPlugins = postcssLoader.options.plugins();
  const autoprefixerIndex = oldPostcssPlugins.findIndex(x => x.postcssPlugin === 'autoprefixer');
  let autoprefixerOptions = {};
  if (autoprefixerIndex !== -1) {
    autoprefixerOptions = oldPostcssPlugins[autoprefixerIndex].options;
    oldPostcssPlugins.splice(autoprefixerIndex, 1);
  }
  const postcssPlugins = [
    require('postcss-import'),
    require('postcss-url'),
    require('postcss-cssnext')(autoprefixerOptions),
    require('postcss-aspect-ratio-mini')({}),
    require('postcss-px-to-viewport')({
      viewportWidth, // (Number) The width of the viewport. 
      viewportHeight, // (Number) The height of the viewport. 
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to. 
      viewportUnit: 'vw', // (String) Expected units. 
      selectorBlackList, // (Array) The selectors to ignore and leave as px. 
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace. 
      mediaQuery: false // (Boolean) Allow px to be converted in media queries. 
    }),
    require('postcss-write-svg')({
      utf8: false
    }),
    require('viewport-units-buggyfill').init({
      hacks: require('viewport-units-buggyfill/viewport-units-buggyfill.hacks'),
    }),
    require('postcss-viewport-units')({
      filterRule: rule => rule.selector.indexOf('::after') === -1 && rule.selector.indexOf('::before') === -1 && rule.selector.indexOf(':after') === -1 && rule.selector.indexOf(':before') === -1,
    }),
    require('cssnano')({
      preset: "advanced", 
      autoprefixer: false, 
      "postcss-zindex": false 
    })
  ].concat(oldPostcssPlugins);
  const newPluginsFun = function () {
    return postcssPlugins;
  }.bind(postcssLoader.options);
  postcssLoader.options.plugins = newPluginsFun;

  return config
}
