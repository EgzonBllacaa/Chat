"use client";

import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "../Components/Navbar";
import Link from "next/link";

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user === null) {
      router.push("/login");
    }
  }, [user, loading, router]);
  console.log(user);
  if (loading) return <span>Loading...</span>;
  return (
    <div className="flex items-center justify-between sm:mx-96 pt-20 text-zinc-950 ">
      <div>
        <div className="flex items-end gap-2">
          <span className="text-lg">Profile Pic:</span>
          {user?.photoURL !== undefined && user?.photoURL !== null && (
            <Image
              alt="user photo"
              className="rounded-2xl max-w-8 w-full"
              width={50}
              height={50}
              src={user?.photoURL}
            />
          )}
        </div>
        <div className="flex flex-col text-lg">
          <span>Your Name: {user?.displayName}</span>
          <span>Your Email: {user?.email}</span>
        </div>
        <span>{user?.phoneNumber}</span>
      </div>
      <Link className="text-xl font-bold " href={"/"}>
        Chat App
      </Link>
    </div>
  );
};

export default DashboardPage;
