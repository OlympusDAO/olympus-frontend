import { Children, ReactNode, cloneElement, ReactElement } from "react";
import { locales } from "src/locales";
import { i18n } from "@lingui/core";

// Component that inverts table columns if the current language is read right to left
export default function I18nOrdering({ children }: { children: ReactNode }) {
  var arrayChildren = Children.toArray(children);
  if (locales[i18n.locale].direction == "rtl") {
    arrayChildren = arrayChildren.reverse();
  }
  return (
    <>
      {Children.map(arrayChildren, (child, index) => {
        return <>{cloneElement(child as ReactElement)}</>;
      })}{" "}
    </>
  );
}
