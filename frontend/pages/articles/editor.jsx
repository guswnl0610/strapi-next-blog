import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useReactiveVar, gql, useQuery } from "@apollo/client";
import nookies from "nookies";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
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

const GET_ARTICLE_BY_USER = gql`
  query ArticleByUser($id: ID!) {
    articleByUser(id: $id) {
      title
      desc
    }
  }
`;

const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($input: updateArticleInput) {
    updateArticle(input: $input) {
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
  const { data: existedArticle } = useQuery(GET_ARTICLE_BY_USER, {
    variables: router.query,
    onCompleted: (data) => {
      if (!data) return;
      setTitle(data.articleByUser.title);
      const content = htmlToDraft(data.articleByUser.desc);
      content &&
        setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(content.contentBlocks)));
    },
  });
  const [createArticle] = useMutation(CREATE_ARTICLE, {
    onCompleted: (data) => {
      router.push(`/articles/${data.createArticle.article.id}`);
    },
  });
  const [updateArticle] = useMutation(UPDATE_ARTICLE, {
    onCompleted: (data) => {
      router.push(`/articles/${data.updateArticle.article.id}`);
    },
  });

  const _userVar = useReactiveVar(userVar);

  const handleComplete = async () => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    if (!title || html === "<p></p>") return alert("내용을 입력해주세요");
    if (existedArticle) {
      updateArticle({
        variables: {
          input: {
            where: router.query,
            data: {
              title,
              desc: html,
            },
          },
        },
      });
      return;
    }
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
