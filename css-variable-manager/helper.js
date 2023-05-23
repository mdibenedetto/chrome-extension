// @ts-check

const isSameDomain = (styleSheet) => {
  // Internal style blocks won't have an href value
  if (!styleSheet.href) {
    return true;
  }

  return styleSheet.href.indexOf(window.location.origin) === 0;
};
const isStyleRule = (rule) => rule.type === 1;

const getCSSCustomPropIndex = () =>
  [...document.styleSheets].filter(isSameDomain).reduce(
    (finalArr, sheet) =>
      finalArr.concat(
        // @ts-ignore
        [...sheet.cssRules].filter(isStyleRule).reduce((propValArr, rule) => {
          // @ts-ignore
          const style = /** @type {CSSStyleDeclaration} */ (rule.style);
          const props = [...style]
            .map((propName) => [
              propName.trim(),
              style.getPropertyValue(propName).trim(),
            ])
            .filter(([propName]) => propName.indexOf('--') === 0);

          return [...propValArr, ...props];
        }, [])
      ),
    []
  );

function getCSSColorVariables() {
  const cssCustomVariables = Array.from(
    // @ts-ignore
    document.documentElement.computedStyleMap
      ? // @ts-ignore
        document.documentElement.computedStyleMap()
      : getCSSCustomPropIndex()
  )
    .filter(
      ([name, value], i) =>
        String(name).startsWith('--') && CSS.supports(`color: ${value}`)
    )
    .map(([name, value]) => [name, value[0][0]]);

  return cssCustomVariables;
}

function updateVariable(name, value) {
  document.documentElement.style.setProperty(name, value);
}
