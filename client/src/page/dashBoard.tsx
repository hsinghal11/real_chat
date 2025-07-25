// "use client";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import BASE_URL from "@/BackendUrl";
// import Search from "@/components/search";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { importKeyFromPem, signMessage, encryptMessage } from "@/lib/cryptoUtils";

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   pic: string;
//   publicKey?: string;
// };

// type Chat = {
//   id: number;
//   chatName: string;
//   isGroupChat: boolean;
//   latestMessage: any;
//   roomId: string;
//   groupPic: string;
//   createdAt: string;
//   updatedAt: string;
//   users: User[];
//   groupAdmins: User[];
// };

// type Message = {
//   content: string;
//   sender: User;
//   createdAt: string;
// };

// const Dashboard = () => {
//   const [searchMode, setSearchMode] = useState<"myChats" | "newUsers">(
//     "myChats"
//   );
//   const [searchInput, setSearchInput] = useState("");
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [searchResults, setSearchResults] = useState<User[]>([]);
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [selectedUser, setselectedUser] = useState<User>();
//   const [publicKey, setPublicKey] = useState<string | null>();

//   const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : "";

//   const fetchChats = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/v1/chat`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.data.success) setChats(res.data.data);
//     } catch (err) {
//       console.error("Error fetching chats", err);
//     }
//   };

//   const handleSearch = async () => {
//     if (searchMode === "newUsers" && searchInput) {
//       try {
//         const res = await axios.get(
//           `${BASE_URL}/api/v1/user/fuzzy-search?email=${searchInput}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setSearchResults(res.data.users || []);
//       } catch (err) {
//         console.error("Fuzzy search error", err);
//       }
//     }
//   };

//   const handleSelectUser = async (user: User) => {
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/api/v1/chat/private`,
//         { userId: user.id },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setSelectedChat(res.data.chat);
//       fetchMessages(res.data.chat.id);
//     } catch (err) {
//       console.error("Failed to access/create chat", err);
//     }
//   };

//   const fetchMessages = async (chatId: number) => {
//     try {
//       const res = await axios.get(`${BASE_URL}/api/v1/message/${chatId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessages(res.data.messages || []);
//     } catch (err) {
//       console.error("Error fetching messages", err);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (selectedUser && selectedUser.publicKey) {
//       setPublicKey(selectedUser.publicKey);
//       const publickeyRecipant = await importKeyFromPem(selectedUser.publicKey, "public", ["encrypt"]);
//     }
//     if (!newMessage || !selectedChat){
//       alert("Please type a message and select a chat.");
//       return;
//     }
//     try {
//       const res = await axios.post(
//         `${BASE_URL}/api/v1/message`,
//         { chatId: selectedChat.id, encryptedContent: newMessage, senderId:  },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setMessages([...messages, res.data.message]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message", err);
//     }
//   };

//   // const handleSendMessage = async () => {
//   //   if (!newMessage.trim() || !selectedChat) {
//   //     alert("Please type a message and select a chat.");
//   //     return;
//   //   }

//   //   // Ensure we have the recipient's public key for encryption
//   //   // In a private chat, `selectedUser` would be the recipient.
//   //   // In a group chat, this gets more complex as you'd need to encrypt for each group member.
//   //   // For simplicity, let's assume private chat or single recipient for now.
//   //   const recipient = selectedUser; // Or fetch based on selectedChat participants

//   //   if (
//   //     !recipient ||
//   //     !recipientEncryptPublicKey ||
//   //     !currentUserSignPrivateKey
//   //   ) {
//   //     alert(
//   //       "Cannot send message: Recipient's public key or your private key not loaded."
//   //     );
//   //     return;
//   //   }

//   //   try {
//   //     // 1. Encrypt the message using the recipient's public key
//   //     const encryptedContent = await encryptMessage(
//   //       recipientEncryptPublicKey,
//   //       newMessage
//   //     );
//   //     console.log("Encrypted Content:", encryptedContent); // For debugging

//   //     // 2. Sign the original plaintext message using the current user's private signing key
//   //     const signature = await signMessage(
//   //       currentUserSignPrivateKey,
//   //       newMessage
//   //     );
//   //     console.log("Digital Signature:", signature); // For debugging

//   //     // 3. Send the encrypted content and signature to the backend
//   //     const res = await axios.post(
//   //       `${BASE_URL}/api/v1/message`,
//   //       {
//   //         chatId: selectedChat.id,
//   //         encryptedContent: encryptedContent, // Use encrypted content
//   //         senderId: currentUserId, // Ensure you pass the current user's ID
//   //         signature: signature, // Pass the digital signature
//   //       },
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );

//   //     if (res.data.success) {
//   //       console.log("Message sent successfully:", res.data.data);
//   //       // Add the encrypted message to local state.
//   //       // You might want to immediately decrypt it for display if it's your own message.
//   //       setMessages([...messages, res.data.data]);
//   //       setNewMessage("");
//   //     } else {
//   //       console.error("Failed to send message:", res.data.message);
//   //       alert(res.data.message || "Failed to send message.");
//   //     }
//   //   } catch (err) {
//   //     console.error("Error sending message:", err);
//   //     alert("An error occurred while sending the message.");
//   //   }
//   // };


//   // const handleSearchResults = (users: User[]) => {
//   //   setSearchResults(users);
//   //   console.log("Received from child:", users);
//   // };

//   useEffect(() => {
//     fetchChats();
//   }, []);

//   return (
//     <>
//       <Search chats={chats} onSearchResults={handleSearchResults} />
//       <Input placeholder="type your message" onChange={e => setNewMessage(e.target.value)}></Input>
//       <Button onClick={handleSendMessage}>Send Message</Button>
//     </>
//   );
// };

// export default Dashboard;


// client/src/YourChatComponent.tsx (or wherever your sending logic resides)
// client/src/YourChatComponent.tsx (or wherever your sending logic resides)

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  encryptMessage,
  signMessage,
  importKeyFromPem,
} from '@/lib/cryptoUtils';

const BASE_URL = 'http://localhost:8000';
const MOCK_AUTH_TOKEN = localStorage.getItem("authToken");
const CURRENT_USER_ID = 5;
const RECIPIENT_USER_ID = 4;
const SELECTED_CHAT_ID = 1;

export default function SimpleMessageSender() {
  const startTime: Date = new Date();
  const [newMessage, setNewMessage] = useState<string>('');

  const [currentUserSignPrivateKey, setCurrentUserSignPrivateKey] = useState<CryptoKey | null>(null);
  const [recipientEncryptPublicKey, setRecipientEncryptPublicKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    console.log("Function: useEffect - START");
    const privateKeyPem = localStorage.getItem("userPrivateKey");
    const signingPrivateKey = localStorage.getItem("userSigningPrivateKey");
    if (privateKeyPem && signingPrivateKey) {
      console.log("Attempting to import current user's private key.");
      const importStart = new Date();
      importKeyFromPem(signingPrivateKey, "private", ["sign"])
        .then(key => {
          setCurrentUserSignPrivateKey(key);
          console.log("Current user's private key for signing loaded.");
          const importEnd = new Date();
          const importDuration = importEnd.getTime() - importStart.getTime();
          console.log(`Importing current user's signing private key took: ${importDuration} ms`);
        })
        .catch(err => console.error("Error importing current user's private key:", err));
    } else {
      console.warn("User private key not found in localStorage. Please ensure user has signed up and generated keys.");
    }

    const fetchAndSetRecipientPublicKey = async () => {
      console.log("Function: fetchAndSetRecipientPublicKey - START");
      const fetchStart = new Date();
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/user/public-key/${RECIPIENT_USER_ID}`, {
          headers: { Authorization: `Bearer ${MOCK_AUTH_TOKEN}` },
        });
        const publicKeyPem = response.data.publicKey;
        if (publicKeyPem) {
          const importPubStart = new Date();
          const encryptKey = await importKeyFromPem(publicKeyPem, "public", ["encrypt"]);
          setRecipientEncryptPublicKey(encryptKey);
          console.log(`Recipient (User ID: ${RECIPIENT_USER_ID}) public key for encryption loaded.`);
          const importPubEnd = new Date();
          const importPubDuration = importPubEnd.getTime() - importPubStart.getTime();
          console.log(`Importing recipient's public key took: ${importPubDuration} ms`);
        } else {
          console.warn("Recipient public key not found in backend response.");
        }
        const fetchEnd = new Date();
        const fetchDuration = fetchEnd.getTime() - fetchStart.getTime();
        console.log(`Fetching and importing recipient's public key total time: ${fetchDuration} ms`);
      } catch (error) {
        console.error("Error fetching or importing recipient's public key:", error);
      }
      console.log("Function: fetchAndSetRecipientPublicKey - END");
    };

    fetchAndSetRecipientPublicKey();
    console.log("Function: useEffect - END");
  }, []);

  const handleSendMessage = async () => {
    const processStartTime = new Date();
    console.log("Function: handleSendMessage - START");
    if (!newMessage.trim()) {
      alert("Message cannot be empty.");
      console.log("handleSendMessage: Message is empty, returning.");
      return;
    }

    if (!currentUserSignPrivateKey || !recipientEncryptPublicKey) {
      alert("Encryption keys are not loaded yet. Please wait or check console for errors.");
      console.log("handleSendMessage: Encryption keys not loaded, returning.");
      return;
    }

    try {
      console.log("handleSendMessage: Starting encryption and signing process.");
      const encryptedContent = await encryptMessage(recipientEncryptPublicKey, newMessage);
      console.log("Original Message:", newMessage);
      console.log("Encrypted Content (Base64):", encryptedContent);

      const signature = await signMessage(currentUserSignPrivateKey, newMessage);
      console.log("Digital Signature (Base64):", signature);

      console.log("handleSendMessage: Sending encrypted message to backend.");
      const res = await axios.post(
        `${BASE_URL}/api/v1/message`,
        {
          chatId: SELECTED_CHAT_ID,
          encryptedContent: encryptedContent,
          senderId: CURRENT_USER_ID,
          signature: signature,
        },
        {
          headers: { Authorization: `Bearer ${MOCK_AUTH_TOKEN}` },
        }
      );

      if (res.data.success) {
        console.log("Message sent successfully:", res.data.data);
        alert("Message sent successfully! Check your backend logs/DB.");
        setNewMessage("");
      } else {
        console.error("Failed to send message:", res.data.message);
        alert(`Failed to send message: ${res.data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("An error occurred while sending the message. Check console for details.");
    }
    const processEndTime = new Date();
    const durationMs = processEndTime.getTime() - processStartTime.getTime();
    console.log(`handleSendMessage: Total time taken: ${durationMs} ms`);
    console.log("Function: handleSendMessage - END");
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Send Encrypted Message</h2>
      <p>
        **For Testing:** Ensure a user is registered (to have a private key in localStorage) and
        the recipient user (ID: {RECIPIENT_USER_ID}) has their public key stored in the backend.
      </p>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="messageInput">Message:</label>
        <input
          id="messageInput"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
      </div>
      <button
        onClick={handleSendMessage}
        disabled={!currentUserSignPrivateKey || !recipientEncryptPublicKey}
        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Send Encrypted Message
      </button>
      {(!currentUserSignPrivateKey || !recipientEncryptPublicKey) && (
        <p style={{ color: 'orange', marginTop: '10px' }}>Loading keys... Please wait.</p>
      )}
    </div>
  );
}