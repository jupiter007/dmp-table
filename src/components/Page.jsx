import React, { useEffect } from 'react';

function Page(props) {
  useEffect(() => {
    document.title = `${props.title}|Complex React App`;
  }, [props.title]);
  return <>{props.children}</>;
}

export default Page;
