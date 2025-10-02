"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import ChatUi from "./ChatUi";
import FriendsList from "./FriendList";
import Link from "next/link";
import Button from "./UI/Button";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa";

const Chat = () => {
  const { user } = useAuth();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friends, setFriends] = useState<
    { id: string; friendshipId: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("friends");
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return setLoading(false);

    // Finding all my friends in one group
    const q = query(
      collection(db, "friendships"),
      where("users", "array-contains", user.uid),
      where("status", "==", "accepted")
    );
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const friendsData = [];

        for (const snapshotDoc of snapshot.docs) {
          const friendId = snapshotDoc
            .data()
            .users.find((id: string) => id !== user.uid);
          const friendDoc = await getDoc(doc(db, "users", friendId));
          if (friendDoc.exists()) {
            friendsData.push({
              id: friendId,
              ...friendDoc.data(),
              friendshipId: snapshotDoc.id,
            });
          }
        }
        console.log(friendsData);
        setFriends(friendsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching friends: ", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user, setFriends]);

  if (loading) return <span>Loading...</span>;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    } finally {
      router.push("/signup");
    }
  };

  return (
    <div
      className={`relative 
        flex flex-col md:flex-row
       w-full  items-start bg-white`}
    >
      {/* Sidebar */}
      <button
        className=" absolute top-0 cursor-pointer pt-7 pl-5"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FaBars className={`${isOpen ? "text-white" : "text-black"}`} />
      </button>
      {isOpen && (
        <div className="sm:md:w-2/6 h-full w-full bg-zinc-800 text-white  border-r ">
          <div className="p-4 border-b border-b-zinc-500 pl-12 flex flex-row justify-between">
            <div>
              <h1 className="text-xl font-bold text-zinc-200">Chat App</h1>
              <p className="text-sm text-gray-300">
                Welcome, {user?.displayName}
              </p>
            </div>
            <div className="flex flex-wrap flex-col justify-center items-center md:flex-row gap-2 md:items-center">
              <Link href={"/dashboard"}>
                <Button className="!bg-transparent text-zinc-100 font-medium border-b border-zinc-500 hover:border-r hover:border-l hover:rounded hover:shadow-zinc-300  hover:shadow-2xs rounded-none  ">
                  Dashboard
                </Button>
              </Link>
              <button
                className="cursor-pointer bg-blue-500 w-fit hover:bg-blue-600 px-4 py-1 rounded"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row border-b border-zinc-500">
            <button
              className={`flex-1 p-3 cursor-pointer ${
                activeTab === "friends"
                  ? "bg-blue-950 hover:bg-blue-400 transition-colors duration-500 ease-in-out px-4 py-2 rounded"
                  : "text-zinc-200"
              }`}
              onClick={() => setActiveTab("friends")}
            >
              Friends
            </button>
            <button
              className={`flex-1 p-3 cursor-pointer ${
                activeTab === "requests"
                  ? "bg-blue-950 hover:bg-blue-400 transition-colors duration-500 ease-in-out px-4 py-2 rounded"
                  : "text-zinc-300"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              Requests
            </button>
          </div>

          <FriendsList
            setIsOpen={setIsOpen}
            activeTab={activeTab}
            friends={friends}
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
          />
        </div>
      )}

      {/* Chat Area */}
      <div
        className={`flex-1 ${
          isOpen ? "hidden" : "flex"
        }  sm:flex w-full flex-col h-full `}
      >
        {selectedFriend ? (
          <ChatUi friend={selectedFriend} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a friend to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
