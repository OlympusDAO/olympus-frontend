import { QueryKey } from "react-query";

export const reactQueryErrorHandler = (key: QueryKey) => {
  return (error: any) => {
    console.log({ key, error: error.message });
  };
};
