import React, { useEffect, useRef, useState, useCallback } from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMutation, useQuery, gql } from "@apollo/client";
import { useUppy } from "hooks/useUppy";
import { Dashboard } from "@uppy/react";
import { initializeApollo } from "lib/apollo/client";
import { CloseCircle } from "react-ionicons";
import checkLoggedIn from "lib/checkLoggedIn";
import BaseLayout from "components/Layout/BaseLayout";
import classNames from "classnames";

export const UPDATE_USER = gql`
  mutation UpdateUser($input: updateUserInput) {
    updateUser(input: $input) {
      user {
        id
        username
        profile_image {
          url
        }
      }
    }
  }
`;

export const MYINFO = gql`
  query {
    myInfo {
      id
      username
      email
      profile_image {
        id
        url
      }
    }
  }
`;

function UserSettings() {
  const { data: me } = useQuery(MYINFO);
  const [updateUser, { data: updatedUser }] = useMutation(UPDATE_USER);
  const uploadedImageIdRef = useRef(me?.myInfo?.profile_image?.id);
  const [hasProfile, setHasProfile] = useState(!!me?.myInfo.profile_image);
  const [data, setData] = useState({
    username: me?.myInfo.username,
  });
  const usernameRef = useRef(null);
  const [validState, setValidState] = useState({ username: { state: true, ref: usernameRef } });

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
    }),
    (result) => {
      const { response } = result.successful[0];
      uploadedImageIdRef.current = response?.body[0].id;
    }
  );

  const handleUpdateUser = async () => {
    for (let key in validState) {
      if (!validState[key].state) return validState[key].ref.current.focus();
    }
    try {
      await updateUser({
        variables: {
          input: {
            where: {
              id: me.myInfo.id,
            },
            data: { ...data, profile_image: uploadedImageIdRef.current },
          },
        },
      });
      router.push("/home");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRemoveProfile = useCallback(() => {
    setHasProfile(false);
    uploadedImageIdRef.current = null;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    const prevState = { ...validState }[name];
    prevState.state = !!value.trim();
    setValidState({ ...validState, [name]: prevState });
  };

  return (
    <BaseLayout>
      <div className="flex flex-col  items-center my-5 mx-auto p-6 max-w-2xl text-gray-700 shadow-lg">
        <div className="flex items-center w-2/3 h-60">
          <p className=" w-32 font-semibold">프로필 사진</p>
          <div className="my-5">
            {hasProfile ? (
              <div className="relative w-36 h-36 overflow-hidden group">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_SERVER}${me?.myInfo.profile_image.url || ""}`}
                  alt="profile"
                  width="144"
                  height="144"
                  objectFit="cover"
                />
                <span
                  className="absolute top-0 right-0 z-10  group-hover:opacity-100 opacity-0 transition-opacity rounded-1/2 cursor-pointer border-gray-400 border-2"
                  onClick={handleRemoveProfile}>
                  <CloseCircle color="#ffffff" />
                </span>
              </div>
            ) : (
              <Dashboard
                uppy={uppy}
                width="10rem"
                height="10rem"
                note="노트"
                locale={{ strings: { dropHereOr: "Drop here or %{browse}", browse: "browse" } }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center w-2/3">
          <p className=" w-32 font-semibold">username</p>
          <div className="my-5">
            <input
              ref={usernameRef}
              type="text"
              name="username"
              value={data.username}
              className={classNames("py-1 px-2 ring-2 rounded-md focus:outline-none", {
                "ring-gray-300": validState.username.state,
                "ring-red-800": !validState.username.state,
                "focus:ring-red-300": validState.username.state,
                "focus:ring-red-800": !validState.username.state,
              })}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex my-5">
          <button
            className="py-2 px-5 bg-gray-200 rounded-xl mr-3 hover:bg-gray-300 transition-colors"
            onClick={() => router.push("/home")}>
            취소
          </button>
          <button
            className="py-2 px-5 bg-red-200 rounded-xl ml-3 hover:bg-red-300 transition-colors"
            onClick={handleUpdateUser}>
            확인
          </button>
        </div>
      </div>
    </BaseLayout>
  );
}

export const getServerSideProps = async (ctx) => {
  const client = initializeApollo(null, ctx);

  await checkLoggedIn(client, ctx);

  return {
    props: {
      initialApolloState: client.cache.extract() || {},
    },
  };
};

export default UserSettings;
