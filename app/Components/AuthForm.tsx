"use client";

import { FcGoogle } from "react-icons/fc";

import Link from "next/link";
import { FormEvent } from "react";

export type AuthFormType = {
  title: string;
  subtitle: string;
  handleSubmit: (e: FormEvent) => void;
  onGoogle: () => void;
  showName: boolean;
  footerText: string;
  footerHref: string;
  footerLink: string;
  name: string;
  setName: (e: string) => void;
  email: string;
  setEmail: (e: string) => void;
  password: string;
  setPassword: (e: string) => void;
  toggleAuthMode: () => void;
};

const AuthForm = ({
  title,
  subtitle,
  handleSubmit,
  onGoogle,
  showName = false,
  footerText,
  footerHref,
  footerLink,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  toggleAuthMode,
}: AuthFormType) => {
  return (
    <>
      <div className="flex flex-col mx-5 sm:mx-10 md:mx-20 lg:mx-50 xl:mx-70 2xl:mx-100 items-center justify-center pt-50 gap-7 text-black">
        <div className="flex flex-col items-center gap-4">
          <span className="text-lg font-bold">{title}</span>
          <span className="font-medium text-center text-zinc-400">
            {subtitle}
          </span>
        </div>
        <div className="text-center border-">
          <button
            onClick={onGoogle}
            className="p-3 mb-4 border rounded-4xl cursor-pointer"
          >
            <FcGoogle size={30} />
          </button>
        </div>
        <div className="relative flex justify-center w-full border-b border-zinc-200">
          <span className="absolute px-20 mx-auto -top-3 bg-zinc-100 text-zinc-900">
            or
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
          {showName && (
            <>
              <label htmlFor="" className="text-teal-800">
                Name:
              </label>
              <input
                className="border-b border-zinc-600 py-1 pl-1 text-lg"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}
          <label htmlFor="" className="text-teal-800">
            Your email:
          </label>
          <input
            className="border-b border-zinc-600 py-1 pl-1 text-lg"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="" className="text-teal-800">
            Password:
          </label>
          <input
            className="border-b border-zinc-600 py-1 pl-1 text-lg"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 py-3 mb-5 font-bold bg-teal-900 text-zinc-200 rounded-2xl"
          >
            Log in
          </button>
          <div className="flex flex-col items-center">
            <span>{footerText}</span>
            <Link
              onClick={toggleAuthMode}
              href={footerHref}
              className="border-b hover:border-b-teal-800"
            >
              {footerLink}
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
export default AuthForm;
