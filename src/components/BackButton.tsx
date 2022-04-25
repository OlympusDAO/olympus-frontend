import { Link } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const BackButton: React.FC = () => {
  const history = useHistory();

  return (
    <Link variant="h6" onClick={history.goBack}>
      BACK
    </Link>
  );
};

export default BackButton;
