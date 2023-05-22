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
