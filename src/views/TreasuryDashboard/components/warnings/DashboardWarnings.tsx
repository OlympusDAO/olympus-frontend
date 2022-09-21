import { DefaultNotification } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownContent from "src/views/TreasuryDashboard/components/warnings/warnings.md";

/**
 * React Component that renders the contents of a Markdown file
 * and displays them in a notification banner.
 */
const DashboardWarnings = (): JSX.Element => {
  const [warningContent, setWarningContent] = useState("");

  // On component mounting, load the content from the Markdown file
  useEffect(() => {
    fetch(MarkdownContent)
      .then(res => res.text())
      .then(md => setWarningContent(md));
  }, []);

  return (
    <DefaultNotification>
      <ReactMarkdown
        children={warningContent}
        className=""
        components={{
          h1: ({ node, ...props }) => <h2 style={{ textAlign: "center" }} {...props} />, // Smaller than h1, center align
        }}
      />
    </DefaultNotification>
  );
};

export default DashboardWarnings;
