import React from "react";

type Props = {
  children: React.ReactNode;
};

const DefaultLayout = (props: Props) => {
  return <div className="wrapper">{props.children}</div>;
};

export default DefaultLayout;
