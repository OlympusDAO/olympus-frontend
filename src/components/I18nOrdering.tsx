import { i18n } from "@lingui/core";
import { Children, cloneElement, ReactElement, ReactNode } from "react";
import { locales } from "src/locales";

// Component that inverts table columns if the current language is read right to left
export default function I18nOrdering({ children }: { children: ReactNode }) {
  let arrayChildren = Children.toArray(children);
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
