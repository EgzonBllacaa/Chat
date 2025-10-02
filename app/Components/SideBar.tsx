"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";

const SideBar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <div
      className={`${
        toggle === false && "bg-zinc-950 max-w-15"
      } flex  flex-col gap-10 p-4 w-1/3 bg-gray-900`}
    >
      <button
        className="cursor-pointer"
        onClick={() => setToggle((prev) => !prev)}
      >
        <FaBars />
      </button>
      {toggle === true && (
        <>
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={10}
                className="rounded-4xl w-15 h-15"
                src="https://picsum.photos/200/300"
                alt="Random Pic"
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">Alex Linderson</span>
                <span className="text-zinc-400">How are you today?</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={10}
                className="rounded-4xl w-15 h-15"
                src="https://picsum.photos/200/300"
                alt="Random Pic"
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">Alex Linderson</span>
                <span className="text-zinc-400">How are you today?</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={10}
                className="rounded-4xl w-15 h-15"
                src="https://picsum.photos/200/300"
                alt="Random Pic"
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">Alex Linderson</span>
                <span className="text-zinc-400">How are you today?</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={10}
                className="rounded-4xl w-15 h-15"
                src="https://picsum.photos/200/300"
                alt="Random Pic"
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">Alex Linderson</span>
                <span className="text-zinc-400">How are you today?</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={10}
                className="rounded-4xl w-15 h-15"
                src="https://picsum.photos/200/300"
                alt="Random Pic"
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">Alex Linderson</span>
                <span className="text-zinc-400">How are you today?</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-5 items-center">
              <Image
                width={400}
                height={10}
                className="rounded-4xl w-15 h-15"
                src="https://picsum.photos/200/300"
                alt="Random Pic"
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">Alex Linderson</span>
                <span className="text-zinc-400">How are you today?</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <Image
              width={400}
              height={10}
              className="rounded-4xl w-15 h-15"
              src="https://picsum.photos/200/300"
              alt="Random Pic"
            />
            <div className="flex flex-col">
              <span className="text-lg font-medium">Alex Linderson</span>
              <span className="text-zinc-400">How are you today?</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <Image
              width={400}
              height={10}
              className="rounded-4xl w-15 h-15"
              src="https://picsum.photos/200/300"
              alt="Random Pic"
            />
            <div className="flex flex-col">
              <span className="text-lg font-medium">Alex Linderson</span>
              <span className="text-zinc-400">How are you today?</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <Image
              width={400}
              height={10}
              className="rounded-4xl w-15 h-15"
              src="https://picsum.photos/200/300"
              alt="Random Pic"
            />
            <div className="flex flex-col">
              <span className="text-lg font-medium">Alex Linderson</span>
              <span className="text-zinc-400">How are you today?</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <Image
              width={400}
              height={10}
              className="rounded-4xl w-15 h-15"
              src="https://picsum.photos/200/300"
              alt="Random Pic"
            />
            <div className="flex flex-col">
              <span className="text-lg font-medium">Alex Linderson</span>
              <span className="text-zinc-400">How are you today?</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <Image
              width={400}
              height={10}
              className="rounded-4xl w-15 h-15"
              src="https://picsum.photos/200/300"
              alt="Random Pic"
            />
            <div className="flex flex-col">
              <span className="text-lg font-medium">Alex Linderson</span>
              <span className="text-zinc-400">How are you today?</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <Image
              width={400}
              height={10}
              className="rounded-4xl w-15 h-15"
              src="https://picsum.photos/200/300"
              alt="Random Pic"
            />
            <div className="flex flex-col">
              <span className="text-lg font-medium">Alex Linderson</span>
              <span className="text-zinc-400">How are you today?</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
          <div className="flex justify-between">
            <Image
              width={400}
              height={10}
              className="rounded-4xl w-15 h-15"
              src="https://picsum.photos/200/300"
              alt="Random Pic"
            />
            <div className="flex flex-col">
              <span className="text-lg font-medium">Alex Linderson</span>
              <span className="text-zinc-400">How are you today?</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-zinc-400">2 min ago</span>
              <span className="bg-red-400 rounded-2xl w-fit py-1 px-2 ">3</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
