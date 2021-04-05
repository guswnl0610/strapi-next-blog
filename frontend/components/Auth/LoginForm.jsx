import React, { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { LOGIN } from "lib/apollo/mutation";

function LoginForm() {
  const [inputState, setInputState] = useState({ identifier: "", password: "" });
  const router = useRouter();
  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      console.log(data);
      router.push("/home");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputState({ ...inputState, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await login({
        variables: {
          input: inputState,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="flex flex-col items-center" onSubmit={handleSubmit}>
      <input
        name="identifier"
        className="p-3 my-3 w-full max-w-md text-md rounded-md border border-gray-200 focus:border-red-200 focus:outline-none"
        type="text"
        value={inputState.identifier}
        placeholder="이메일을 입력하세요"
        onChange={handleInputChange}
      />
      <input
        name="password"
        className="p-3 my-3 w-full max-w-md text-md rounded-md border-gray-200 border focus:border-red-200 focus:outline-none"
        type="password"
        value={inputState.password}
        placeholder="비밀번호를 입력하세요"
        onChange={handleInputChange}
      />
      <button className="bg-red-300 max-w-md w-full py-3 px-6 my-3 text-md rounded-lg text-white hover:bg-red-400 transition-colors">
        로그인
      </button>
    </form>
  );
}

export default LoginForm;
