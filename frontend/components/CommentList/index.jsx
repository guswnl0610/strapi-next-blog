import { useState, useCallback, useRef } from "react";
import { useReactiveVar, gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Image from "next/image";
import { TrashOutline } from "react-ionicons";
import { userVar } from "lib/apollo/store";

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: createCommentInput) {
    createComment(input: $input) {
      comment {
        id
        user {
          id
          username
          profile_image {
            url
          }
        }
        likes
        content
        created_at
      }
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($input: deleteCommentInput) {
    deleteComment(input: $input) {
      comment {
        id
      }
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: updateCommentInput) {
    comment {
      id
      user {
        id
        username
        profile_image {
          url
        }
      }
      likes
      content
      created_at
    }
  }
`;

const GET_ARTICLE = gql`
  query Article($id: ID!) {
    article(id: $id) {
      id
      created_at
      title
      desc
      likes
      user {
        username
        email
        profile_image {
          url
        }
      }
      comments {
        id
        user {
          id
          username
          profile_image {
            url
          }
        }
        likes
        content
        created_at
      }
    }
  }
`;

function CommentList({ article }) {
  const [comment, setComment] = useState("");
  const _userVar = useReactiveVar(userVar);
  const router = useRouter();
  // const modifyingCommentIdRef = useRef(null);
  const [modifyingCommentId, setModifyingCommentId] = useState(null);

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    update(cache, { data }) {
      const existingArticle = cache.readQuery({
        query: GET_ARTICLE,
        variables: {
          id: router.query.id,
        },
      });
      const newComments = existingArticle.article.comments.filter(
        (comment) => comment.id !== data.deleteComment.comment.id
      );
      cache.writeQuery({
        query: GET_ARTICLE,
        data: {
          article: {
            ...existingArticle.article,
            comments: newComments,
          },
        },
      });
    },
  });

  const [createComment, { data, error }] = useMutation(CREATE_COMMENT, {
    update(cache, { data }) {
      const existingArticle = cache.readQuery({
        query: GET_ARTICLE,
        variables: {
          id: router.query.id,
        },
      });
      const newComments = [...existingArticle.article.comments, data.createComment.comment];
      cache.writeQuery({
        query: GET_ARTICLE,
        data: {
          article: {
            ...existingArticle.article,
            comments: newComments,
          },
        },
      });
    },
  });

  const [updateComment] = useMutation(UPDATE_COMMENT);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    createComment({
      variables: {
        input: {
          data: {
            content: comment,
            user: _userVar.id,
            article: router.query.id,
            likes: 0,
          },
        },
      },
    });
    setComment("");
  };

  const handleChange = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  return (
    <>
      <div>
        {article?.comments.map((comment) => {
          return (
            <>
              <div key={comment.id} className="flex justify-between py-2">
                <div className="flex">
                  <div className="flex items-center w-32">
                    <div className="relative flex items-center justify-center w-5 h-5 mr-2 rounded-1/2 overflow-hidden ">
                      {comment.user.profile_image ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_SERVER}${comment.user.profile_image.url}`}
                          width="20"
                          height="20"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-300" />
                      )}
                    </div>
                    <span>{comment.user.username}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
                {comment.user.id === _userVar?.id && (
                  <div className="flex">
                    <span className="text-gray-500 mr-2" onClick={() => setModifyingCommentId(comment.id)}>
                      편집
                    </span>
                    <span onClick={() => deleteComment({ variables: { input: { where: { id: comment.id } } } })}>
                      <TrashOutline color="red" />
                    </span>
                  </div>
                )}
              </div>
              {modifyingCommentId === comment.id && (
                <form className="flex">
                  <input
                    type="text"
                    className=" flex-1 px-3 ring-2 ring-gray-200 rounded-lg focus:outline-none focus:ring-red-100"
                  />
                  <button className="py-2 px-4 ml-3 bg-red-200 rounded-lg">수정</button>
                  <button className="py-2 px-4 ml-3 bg-gray-200 rounded-lg" onClick={() => setModifyingCommentId(null)}>
                    취소
                  </button>
                </form>
              )}
            </>
          );
        })}
      </div>
      <form className="flex pt-7" onSubmit={handleSubmit}>
        <input
          className="flex-1 py-2 px-2 mr-3 ring-2 ring-gray-200 rounded-lg focus:outline-none focus:ring-red-200"
          type="text"
          value={comment}
          onChange={handleChange}
        />
        <button className="py-2 px-4 bg-red-200 rounded-xl">Submit</button>
      </form>
    </>
  );
}

export default CommentList;
