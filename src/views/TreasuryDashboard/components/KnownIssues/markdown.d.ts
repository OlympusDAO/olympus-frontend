// Tells the compiler how to handle markdown files
declare module "*.md" {
  const value: string;
  export default value;
}
