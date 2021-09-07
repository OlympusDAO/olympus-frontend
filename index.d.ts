declare module "*.jpg";
declare module "*.png";
declare module "*.svg" {
  const content: string;
  export default content;
}
