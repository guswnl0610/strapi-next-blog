import React, { useEffect, useRef } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { useRouter } from "next/router";
import { useReactiveVar, useMutation } from "@apollo/client";
import { useAuth } from "hooks/useAuth";
import { useUppy } from "hooks/useUppy";
import { Dashboard } from "@uppy/react";
import { initializeApollo } from "lib/apollo/client";
import { MYINFO } from "lib/apollo/query";
import { UPDATE_USER } from "lib/apollo/mutation";
import { userVar } from "lib/apollo/store";
import nookies from "nookies";

function UserSettings() {
  const [updateUser, { data: updatedUser }] = useMutation(UPDATE_USER);
  const _userVar = useReactiveVar(userVar);
  const uploadedImageIdRef = useRef(null);
  const router = useRouter();
  const uppy = useUppy(
    new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: [".png", ".jpg", "jpeg", ".gif"],
      },
      autoProceed: true,
      allowMultipleUploads: false,
    }).use(XHRUpload, {
      endpoint: `${process.env.NEXT_PUBLIC_API_SERVER}/upload`,
      formData: true,
      fieldName: "files",
      limit: 1,
    })
  );

  useAuth();

  const handleUpdateUser = async () => {
    try {
      console.log(uploadedImageIdRef.current);
      updateUser({
        variables: {
          input: {
            where: {
              id: _userVar.id,
            },
            data: {
              profile_image: uploadedImageIdRef.current,
            },
          },
        },
      });
      router.push("/home");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    uppy.on("complete", (result) => {
      console.log(result);
      const { response } = result.successful[0];
      uploadedImageIdRef.current = response?.body[0].id;
    });

    return () => uppy.off("complete");
  }, []);

  useEffect(() => {
    if (!_userVar || !_userVar.profile_image) return;
    fetch(`${process.env.NEXT_PUBLIC_API_SERVER}${_userVar?.profile_image?.url}`)
      .then((res) => res.blob())
      .then((blob) => uppy.addFile({ name: "image.jpg", type: blob.type, data: blob }));
  }, [_userVar]);

  console.log(updatedUser);

  return (
    <div className="flex flex-col  items-center my-5 mx-auto p-6 max-w-2xl text-gray-700 shadow-lg">
      <span>Profile</span>
      <div className=" my-5">
        <Dashboard
          uppy={uppy}
          width="10rem"
          height="10rem"
          note="노트"
          locale={{ strings: { dropHereOr: "Drop here or %{browse}", browse: "browse" } }}
        />
      </div>
      <div className="flex">
        <button className="py-2 px-5 bg-gray-200 rounded-xl mr-3 hover:bg-gray-300 transition-colors">취소</button>
        <button
          className="py-2 px-5 bg-red-200 rounded-xl ml-3 hover:bg-red-300 transition-colors"
          onClick={handleUpdateUser}>
          확인
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  // console.log(context.req.cookies);
  const client = initializeApollo(null, ctx);
  try {
    await client.query({ query: MYINFO });
  } catch (error) {
    console.log(error);
    nookies.destroy(ctx, "token");
  }

  return {
    props: {
      initialApolloState: client.cache.extract() || {},
    },
  };
};

export default UserSettings;
