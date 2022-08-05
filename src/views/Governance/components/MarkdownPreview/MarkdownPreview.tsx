import { Box, Link, styled } from "@mui/material";
import ReactMarkdown from "react-markdown";

export const MarkdownPreview = (props: { content: string }) => {
  const { content } = props;
  const StyledBoxItem = styled(Box)(() => ({
    "p > img": {
      maxWidth: "100%",
    },
  }));

  return (
    <StyledBoxItem>
      <ReactMarkdown
        components={{
          a: Link,
        }}
        children={content}
      />
    </StyledBoxItem>
  );
};
