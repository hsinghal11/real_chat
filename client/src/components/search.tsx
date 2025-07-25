import BASE_URL from '@/BackendUrl';
import axios from 'axios';
import React, { useState } from 'react'
import { Input } from './ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';

type User = {
  id: number;
  name: string;
  email: string;
  pic: string;
  publicId?: string;
};

type Chat = {
  id: number;
  chatName: string;
  isGroupChat: boolean;
  latestMessage: any;
  roomId: string;
  groupPic: string;
  createdAt: string;
  updatedAt: string;
  users: User[];
  groupAdmins: User[];
};

type Message = {
  content: string;
  sender: User;
  createdAt: string;
};
type SearchProps = {
  chats: Chat[];
  onSearchResults: (users: User[]) => void; // callback to pass users back to parent
};

const Search = ({ chats, onSearchResults }: SearchProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchMode, setSearchMode] = useState<"myChats" | "newUsers">(
    "newUsers"
  );
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : "";
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const handleSearch = async () => {
    if (searchMode === "newUsers" && searchInput) {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/user/fuzzy-search?email=${searchInput}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const users = res.data.users || [];
        setSearchResults(users);
        console.log(users);
        onSearchResults(users); // pass to parent here
      } catch (err) {
        console.error("Fuzzy search error", err);
      }
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="name">Name</Label>
      <Input
        type="text"
        placeholder="Search for email"
        required
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default Search;