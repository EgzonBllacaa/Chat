"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { forwardRef } from "react";

// Define TypeScript types
type User = {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
};

type Friend = User & {
  id: string;
  friendshipId: string;
};

type FriendRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  createdAt: Date;
  sender: User;
};

type SearchResult = User & {
  id: string;
};

type FirestoreUser = {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  createdAt?: Timestamp;
};

type Props = {
  activeTab: string;
  friends: Friend[];
  selectedFriend: Friend | null;
  setSelectedFriend: (friend: Friend) => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function FriendsList({
  setIsOpen,
  activeTab,
  friends,
  selectedFriend,
  setSelectedFriend,
}: Props) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  // Fetch pending friend requests
  useEffect(() => {
    if (!user || activeTab !== "requests") return;

    const q = query(
      collection(db, "friendships"),
      where("receiverId", "==", user.uid),
      where("status", "==", "pending")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const requests: FriendRequest[] = [];

      for (const snapshotDoc of snapshot.docs) {
        const data = snapshotDoc.data();
        const senderDoc = await getDoc(doc(db, "users", data.senderId));

        if (senderDoc.exists()) {
          const senderData = senderDoc.data() as FirestoreUser;
          const sender: User = {
            uid: senderData.uid,
            displayName: senderData.displayName,
            email: senderData.email,
            photoURL: senderData.photoURL,
          };

          requests.push({
            id: snapshotDoc.id,
            senderId: data.senderId,
            receiverId: data.receiverId,
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            sender: sender,
          });
        }
      }
      setFriendRequests(requests);
    });

    return () => unsubscribe();
  }, [user, activeTab]);

  const searchUsers = async (): Promise<void> => {
    if (!searchTerm.trim() || !user) return;

    setSearching(true);
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const results: SearchResult[] = [];

      snapshot.docs.forEach((doc) => {
        const userData = doc.data() as FirestoreUser;

        // Only include users that aren't the current user and match search term
        if (userData.uid !== user.uid) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch =
            userData.displayName?.toLowerCase().includes(searchLower) ||
            userData.email?.toLowerCase().includes(searchLower);
          if (matchesSearch) {
            results.push({
              id: doc.id,
              uid: userData.uid,
              displayName: userData.displayName,
              email: userData.email,
              photoURL: userData.photoURL,
            });
          }
        }
      });

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setSearching(false);
    }
  };

  const sendFriendRequest = async (receiverId: string): Promise<void> => {
    if (!user) return;

    try {
      // Check if request already exists
      const existingRequestQuery = query(
        collection(db, "friendships"),
        where("senderId", "==", user.uid),
        where("receiverId", "==", receiverId)
      );

      const existingSnapshot = await getDocs(existingRequestQuery);
      if (!existingSnapshot.empty) {
        setSnackbarMessage("Friend request already sent!");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        return;
      }

      // Also check if reverse request exists
      const reverseRequestQuery = query(
        collection(db, "friendships"),
        where("senderId", "==", receiverId),
        where("receiverId", "==", user.uid)
      );

      const reverseSnapshot = await getDocs(reverseRequestQuery);
      if (!reverseSnapshot.empty) {
        setSnackbarMessage(
          "This user has already sent you a friend request! Check the Requests tab."
        );
        // alert("");
        setSnackbarSeverity("warning");
        setSnackbarOpen(true);
        return;
      }

      await addDoc(collection(db, "friendships"), {
        senderId: user.uid,
        receiverId: receiverId,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setSearchTerm("");
      setSearchResults([]);
      setSnackbarMessage("Friend request sent!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Error sending friend request");
    }
  };

  const acceptFriendRequest = async (requestId: string): Promise<void> => {
    if (!user) return;

    try {
      const requestDoc = doc(db, "friendships", requestId);
      const requestSnapshot = await getDoc(requestDoc);

      if (requestSnapshot.exists()) {
        const requestData = requestSnapshot.data();
        await updateDoc(requestDoc, {
          status: "accepted",
          users: [user.uid, requestData.senderId],
          acceptedAt: serverTimestamp(),
        });
        setSnackbarMessage("Friend request accepted!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setSnackbarMessage("Error accepting friend request");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const rejectFriendRequest = async (requestId: string): Promise<void> => {
    try {
      await updateDoc(doc(db, "friendships", requestId), {
        status: "rejected",
      });
      setSnackbarMessage("Friend request rejected");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      setSnackbarMessage("Error rejecting friend request");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchUsers();
    }
  };

  // Clear search when switching tabs
  useEffect(() => {
    setSearchTerm("");
    setSearchResults([]);
  }, [activeTab]);

  if (activeTab === "friends") {
    return (
      <div className="flex flex-col">
        {/* Search Section */}
        <div className="p-4 border-b border-zinc-600 flex flex-col">
          <div className="mb-3 w-full">
            <h3 className="font-semibold text-lg mb-2 text-zinc-200">
              Add New Friends
            </h3>
            <div className="flex w-full flex-col xl:flex-row gap-2">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 p-2  placeholder:text-zinc-400 border border-zinc-600 rounded text-sm text-zinc-200 "
              />
              <button
                onClick={searchUsers}
                disabled={searching}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 text-sm"
              >
                {searching ? "..." : "Search"}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-200 mb-2">
                Search Results:
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-2 border border-zinc-500 rounded flex justify-between items-center hover:bg-gray-950"
                  >
                    <div>
                      <span className="font-medium block">
                        {result.displayName}
                      </span>
                      {result.email && (
                        <span className="text-xs text-gray-500">
                          {result.email}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => sendFriendRequest(result.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto text-zinc-800">
          <h3 className="p-3 font-semibold border-b text-zinc-300 border-zinc-600 bg-zinc-900">
            Your Friends ({friends.length})
          </h3>

          {friends.length === 0 ? (
            <div className="p-4 text-center text-gray-200">
              <p className="mb-2">No friends yet.</p>
              <p className="text-sm">Search for users above to add friends!</p>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                className={`p-3 border-b border-zinc-600 cursor-pointer transition-colors ${
                  selectedFriend?.id === friend.id
                    ? "bg-blue-50 border-blue-200"
                    : "hover:bg-gray-900 text-zinc-200"
                }`}
                onClick={() => {
                  setIsOpen((prev: boolean) => !prev);
                  setSelectedFriend(friend);
                }}
              >
                <h2 className="font-medium">
                  {friend.displayName.charAt(0).toUpperCase() +
                    friend.displayName.slice(1)}
                </h2>
                {friend.email && (
                  <div className="text-sm text-gray-500">{friend.email}</div>
                )}
              </div>
            ))
          )}
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <h3 className="p-3 font-semibold text-zinc-600  bg-gray-50">
          Friend Requests ({friendRequests.length})
        </h3>

        {friendRequests.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No pending friend requests
          </div>
        ) : (
          friendRequests.map((request) => (
            <div key={request.id} className="p-3 hover:bg-gray-50">
              <div className="font-medium">{request.sender.displayName}</div>
              {request.sender.email && (
                <div className="text-sm text-gray-500">
                  {request.sender.email}
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">
                Sent {request.createdAt.toLocaleDateString()}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => acceptFriendRequest(request.id)}
                  className="flex-1 bg-green-500 text-white p-1 rounded hover:bg-green-600 text-sm"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectFriendRequest(request.id)}
                  className="flex-1 bg-red-500 text-white p-1 rounded hover:bg-red-600 text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
