import { SvgIcon, SvgIconProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import tokenPath from "src/components/library/Token/tokensLib";

const PREFIX = "Token";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledSvgIcon = styled(SvgIcon)(() => ({
  [`&.${classes.root}`]: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    margin: "12px 0px",
  },
}));

export interface OHMTokenProps extends SvgIconProps {
  name: keyof typeof tokenPath;
  viewBox?: string;
  fontSize?: SvgIconProps["fontSize"];
}
/**
 * Primary Token Component for UI. This component displays a SVG Token Asset from the OlympusDAO Token Library.
 *
 * ## Updating Component Library with a New Token Asset
 * You may find that a specific token asset is not available inside of the component library package. To add a new token to component-library follow the following steps.
 * 
 * #### Step 1
 * Ensure your SVG file is optimized using svgo. Run ```npx svgo <yourasset.svg> ```
 * 
 * #### Step 2
 * We've tried to make sure default viewports, viewboxes and overall heights/widths are aligned to a standard 32x32 as a base default. 
 *  https://boxy-svg.com/ is a great resource to verify that the default width/height of the SVG is set properly and that the viewbox is set to 32x32. Once verified/modified, export the SVG and move to the next step.
 * 
 * #### Step 3
 * Convert your SVG to a react component by running ```npx @svgr/cli <YourProperlySized.svg>```. SVGR will automatically normalize your SVG and rename attributes to play nice with react. 
 * You'll see a react component output to the command line. Copy the output BETWEEN the starting and closing ```<svg></svg>``` tags. Exclude the starting/ending ```<svg>``` tags. 
 *
 *  #### Step 4
 * Add a new Key:Value to tokensLib.tsx with Key being ALL CAPS for a Token Symbol or all lowercase for a network/other type of token. 
 * Example
 * 
 * ```jsx
 *   AVAX: (
 *   <>
 *     <path
 *       style={{
 *         fill: "#fff",
 *         strokeWidth: 0.02130493,
 *       }}
 *       d="M6.104 5.475h19.771v17.981H6.104z"
 *     />
 *     <path
 *       d="M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16Zm-20.534 6.367H8.361c-.653 0-.975 0-1.171-.126a.79.79 0 0 1-.358-.617c-.012-.232.15-.515.472-1.08L14.97 7.028c.326-.574.49-.86.7-.967a.791.791 0 0 1 .715 0c.208.106.373.393.7.967L18.66 9.78l.008.014c.353.615.531.927.61 1.255.086.358.086.735 0 1.093-.08.33-.256.644-.614 1.27l-4.027 7.119-.01.018c-.355.62-.535.935-.784 1.172-.271.26-.597.448-.955.555-.326.09-.692.09-1.423.09zm7.842 0h4.449c.656 0 .987 0 1.183-.13a.787.787 0 0 0 .358-.62c.011-.225-.146-.497-.455-1.03l-.033-.055-2.228-3.813-.026-.043c-.313-.53-.471-.797-.674-.9a.783.783 0 0 0-.711 0c-.205.106-.37.385-.696.947l-2.22 3.813-.009.013c-.325.56-.487.841-.476 1.071a.796.796 0 0 0 .358.622c.193.125.523.125 1.18.125z"
 *       style={{
 *         clipRule: "evenodd",
 *         fill: "#e84142",
 *         fillRule: "evenodd",
 *         strokeWidth: 0.02130493,
 *       }}
 *     />
 *   </>
 * ),
  ```
 *  
 * #### Step 5
 * Submit a PR to the component-library project, to be published in the next npm package release. 
 */

const Token: FC<OHMTokenProps> = ({ name, viewBox = "0 0 32 32", fontSize = "large", ...props }) => {
  return (
    <StyledSvgIcon viewBox={viewBox} fontSize={fontSize} {...props}>
      {tokenPath[name]}
    </StyledSvgIcon>
  );
};

export default Token;
export type TokenName = keyof typeof tokenPath;
