"use client";
import React from "react";
// import SideBar from "./Components/SideBar";
// import ChatUi from "./Components/ChatUi";
import { useAuth } from "./context/AuthContext";
import AuthContainer from "./Components/AuthContainer";
import Chat from "./Components/Chat";

const MainPage = () => {
  const { user } = useAuth();
  return (
    <>
      {user === null ? (
        <AuthContainer />
      ) : (
        <div className="flex w-full h-full">
          <Chat />
        </div>
      )}
    </>
  );
};

export default MainPage;
