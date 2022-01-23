declare module "*.jpg";
declare module "*.png";
declare module "*.svg";

declare global {
  interface CustomWindow extends Window {
    console: any;
    analytics: any;
  }
}

export default global;
