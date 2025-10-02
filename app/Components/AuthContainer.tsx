"use client";

import AuthForm from "@/app/Components/AuthForm";

import { auth, db, googleAuthProvider } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import React, { FormEvent, useState } from "react";

const AuthContainer = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const createdUser = cred.user;
        if (name) {
          await updateProfile(createdUser, { displayName: name });
        }

        await setDoc(doc(db, "users", createdUser.uid), {
          uid: createdUser.uid,
          displayName: createdUser.displayName || name || "",
          email: createdUser.email || "",
          photoURL: createdUser.photoURL || null,
          createdAt: serverTimestamp(),
        });

        router.push("/");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
      router.push("/");
    }
  };
  const onGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
      });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AuthForm
        title={`${isSignUp ? "Sign up" : "Log in"} to ChatBox`}
        subtitle={`
            "Welcome back! ${
              isSignUp ? "Sign Up" : "Sign in"
            } using your Google account or email to continue us`}
        handleSubmit={handleSubmit}
        onGoogle={onGoogle}
        footerText={
          isSignUp ? "You have an account?" : "You don't have an account?"
        }
        footerHref={isSignUp ? "/login" : "/signup"}
        footerLink={isSignUp ? "Log In here" : "Sign Up here"}
        showName={isSignUp ? true : false}
        email={email}
        setEmail={setEmail}
        setName={setName}
        name={name}
        password={password}
        setPassword={setPassword}
        toggleAuthMode={() => setIsSignUp((prev: boolean) => !prev)}
      />
    </>
  );
};

export default AuthContainer;
