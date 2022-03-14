import { Avatar, Button, Flex, FormControl, Heading, Input, Text } from '@chakra-ui/react'
import Head from 'next/head'
import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'
import { addDoc, collection, doc, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebaseconfig'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../firebaseconfig'
import getOtherEmail from '../../utils/getOtherEmail'
import { useRef } from 'react'
import { useEffect } from 'react'

export default function Chat() {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const { id } = router.query

  const q = query(collection(db, `chats/${id}/messages`), orderBy("timestamp"))
  const [messages] = useCollectionData(q)

  const [chat] = useDocumentData(doc(db, 'chats', id))
  const bottomOfChat = useRef();
  
  const getMessage = () => 
    messages?.map(msg => {
      const sender = msg.sender === user.email
      return (
        <Flex key={Math.random()} alignSelf={sender ? 'flex-start' : 'flex-end'} bg={sender ? "blue.100" : "green.100"} w="fit-content" minWidth="100px" borderRadius="lg" p={3} mx={1}>
          <Text>{msg.text}</Text>
        </Flex>
      )
    })

  useEffect(() =>
    setTimeout(
      bottomOfChat.current.scrollIntoView({
      behavior: "smooth",
      block: 'start',
    }), 100)
  , [messages])
  

  const Topbar = ({email}) => {
    return (
      <Flex bg="gray.100" w="100%" h="81px" align="center" p={5}>
        <Avatar marginEnd={3} />
        <Heading size="lg">{email}</Heading>
      </Flex>
    )
  }

  const Bottombar = ({id, user}) => {
    const [input, setInput] = useState("")
    
    const sendMessage = async (e) => {
      e.preventDefault()
      await addDoc(collection(db, `chats/${id}/messages`), {
        text: input,
        sender: user.email,
        timestamp: serverTimestamp()
      })
      setInput("")
    }


    return (
      <Flex>
        <Head>
          <title>Chat</title>
        </Head>

        <FormControl p={3} onSubmit={sendMessage} as="form">
          <Input placeholder='Type a message' autoComplete="off" onChange={(e) => setInput(e.target.value)} value={input} />
          <Button type='submit' hidden>
            Submit
          </Button>
        </FormControl>
      </Flex>
    )
  }

  return (
    <div>
      <Flex h="100vh">
        <Sidebar />
        <Flex flex={1} direction="column">
          <Topbar email={getOtherEmail(chat?.users, user.email)} />

          <Flex flex={1} pt={4} mx={5} direction="column" overflowX="scroll">
            {getMessage()}
            <div ref={bottomOfChat}></div>
          </Flex>

          <Bottombar id={id} user={user} />
        </Flex>
      </Flex>
    </div>
  )
}
