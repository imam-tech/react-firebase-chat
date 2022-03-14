import { ArrowLeftIcon } from "@chakra-ui/icons";
import { Avatar, Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import React from "react";
import { auth, db } from "../firebaseconfig";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc } from "@firebase/firestore";
import getOtherEmail from "../utils/getOtherEmail";
import { useRouter } from "next/router";

export default function Sidebar() {
  const [user] = useAuthState(auth)
  const [snapshot] = useCollection(collection(db, 'chats'));
  const chats = snapshot?.docs.map(doc => ({id: doc.id, ...doc.data()}))
  const router = useRouter()
  
  const redirect = (id) => {
    router.push(`/chat/${id}`)
  }

  const chatIfExist = email => chats?.find(chat => chat.users.includes(user.email) && chat.users.includes(email))

  const newChat = async() => {
    const input = prompt('Enter email of chat recipient')
    if (!chatIfExist(input) && (input != user.email)) {
      await addDoc(collection(db, 'chats'), { users: [input, user.email] })
    }
  }

  const chatList = () => {
    return (
      chats?.filter(chat => chat.users.includes(user.email))
      .map(
        chat => 
          <Flex key={Math.random()} p={3} align="center" _hover={{bg: "gray.200", cursor: "pointer"}} onClick={() => redirect(chat.id)}>
            <Avatar marginEnd={3} />
            <Text>{getOtherEmail(chat.users, user)}</Text>
          </Flex>
      )
    )
  }

  return (
    <Flex
      // bgColor="blue.100"
      w="300px"
      borderEnd="1px solid"
      borderColor="gray.200"
      direction="column"
    >
      <Flex
        // bg="red.100"
        h="81px"
        w="100%"
        align="center" justifyContent="space-between"
        p={3}
        borderBottom="1px solid" borderColor="gray.200"
      >
        <Flex align="center">
          <Avatar src={user.photoURL} marginEnd={3} />
          <Text>{user.displayName}</Text>
        </Flex>
        <IconButton size="sm" onClick={() => signOut(auth)} isRound icon={<ArrowLeftIcon />} />
      </Flex>
      <Button m={5} p={4} onClick={() => newChat()}>New Chat</Button>
      <Flex overflowX="scroll" direction="column" sx={{scrollbarWidth:"none"}} flex={1}>
        {chatList()}
      </Flex>
    </Flex>
  );
}
