import React from "react";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "lib/apollo/store";
import { Dashboard } from "@uppy/react";

function Uploader({ uppy }) {
  const _userVar = useReactiveVar(userVar);

  useEffect(() => {
    if (!_userVar || !_userVar.profile_image) return;
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER}${_userVar?.profile_image?.url}`)
      .then((res) => res.blob())
      .then((blob) => uppy.addFile({ name: "image.jpg", type: blob.type, data: blob }));
  }, [_userVar]);

  return (
    <Dashboard
      uppy={uppy}
      width="20rem"
      height="20rem"
      locale={{ strings: { dropPaste: "Drop here or %{browse}", browse: "browse" } }}
    />
  );
}

export default Uploader;
