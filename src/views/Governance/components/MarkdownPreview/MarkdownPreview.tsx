import { Box, Link, styled, useTheme } from "@mui/material";
import { TertiaryButton } from "@olympusdao/component-library";
import { ClassAttributes, ImgHTMLAttributes, useState } from "react";
import ReactMarkdown from "react-markdown";

export const MarkdownPreview = (props: { content: string }) => {
  const { content } = props;
  const StyledBoxItem = styled(Box)(() => ({
    "p > img": {
      maxWidth: "100%",
    },
  }));

  const allowedImgDomains = ["i.imgur.com"];
  const PreviewImage = (
    props: JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement>,
  ) => {
    const srcUrl = new URL(props.src ? props.src : "");

    const whitelistedDomain = allowedImgDomains.find(domain => domain === srcUrl.hostname);

    const returnedComponent = whitelistedDomain ? <img {...props} /> : <Warning {...props} />;
    return returnedComponent;
  };

  const Warning = (props: any) => {
    const theme = useTheme();
    const [displayImage, setDisplayImage] = useState(false);
    return displayImage ? (
      <img {...props} />
    ) : (
      <Box display="flex" border={`1px dashed ${theme.colors.gray[10]}`} padding="40px" justifyContent="center">
        <Box display="flex" flexDirection="column">
          Image is not hosted on an approved pinning domain. Image may have been updated after proposal submission.
          <Box display="flex" mt="25px" justifyContent="center">
            <TertiaryButton onClick={() => setDisplayImage(true)}>View Image Anyway</TertiaryButton>
          </Box>
        </Box>
      </Box>
    );
  };
  return (
    <StyledBoxItem>
      <ReactMarkdown
        components={{
          a: Link,
          img: ({ node, ...props }) => <PreviewImage {...props} />,
        }}
        children={content}
      />
    </StyledBoxItem>
  );
};
