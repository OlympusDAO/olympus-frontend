import { useEffect } from "react";
import { CancelCallback } from "src/views/Give/Interfaces";

export const useOnEscape = (handler: CancelCallback) => {
  useEffect(() => {
    console.log("useEffect");
    const escHandler = (e: KeyboardEvent) => {
      console.log(e.key);
      if (e.key === "Meta") handler();
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, []);
};

// export const useOnOutsideClick = (ref: RefObject<HTMLElement>, handler: CancelCallback): void => {
//   useEffect(() => {
//     const listener = (e: MouseEvent) => {
//       console.log("current = " + ref.current?.outerHTML);
//       //   console.log("target = " + (e.target as Node).outerHTML);
//       // Do nothing if clicking ref's element or descendent elements
//       if (!ref.current || ref.current.contains(e.target as Node)) {
//         console.log("inside");
//         return;
//       }

//       console.log("outside");
//       handler();
//     };

//     document.addEventListener("mousedown", listener);

//     return () => {
//       document.removeEventListener("mousedown", listener);
//     };
//   }, [ref]); // Empty array ensures that effect is only run on mount and unmount
// };
