import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useReactiveVar, gql } from "@apollo/client";
import nookies from "nookies";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import BaseLayout from "components/Layout/BaseLayout";
const Editor = dynamic(() => import("components/Editor/index"), { ssr: false });
import { initializeApollo } from "lib/apollo/client";
import { userVar } from "lib/apollo/store";
import checkLoggedIn from "lib/checkLoggedIn";

const CREATE_ARTICLE = gql`
  mutation CreateArticle($input: createArticleInput) {
    createArticle(input: $input) {
      article {
        id
      }
    }
  }
`;

function ArticleEditor(props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [createArticle] = useMutation(CREATE_ARTICLE, {
    onCompleted: (data) => {
      router.push(`/articles/${data.createArticle.article.id}`);
    },
  });
  const _userVar = useReactiveVar(userVar);

  const handleComplete = async () => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (!title || html === "<p></p>") return alert("내용을 입력해주세요");
    createArticle({
      variables: {
        input: {
          data: {
            title,
            desc: html,
            likes: 0,
            user: _userVar.id,
          },
        },
      },
    });
  };

  return (
    <BaseLayout>
      <div className="flex flex-col items-end max-w-4xl my-6 p-10 mx-auto shadow-xl">
        <div>
          <button className="py-2 px-5 bg-gray-200 mb-2 rounded-lg mr-3" onClick={() => router.back()}>
            취소
          </button>
          <button className="py-2 px-5 bg-red-200 mb-2 rounded-lg" onClick={handleComplete}>
            완료
          </button>
        </div>
        <input
          type="text"
          className="w-full my-3 pl-2 pb-2 text-2xl border-b border-gray-200 focus:outline-none focus:border-red-200"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Editor editorState={editorState} setEditorState={setEditorState} />
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

export default ArticleEditor;
