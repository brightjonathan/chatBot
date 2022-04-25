import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";
import { io } from "socket.io-client";
import { contactRouter, host } from "../Utils/APIRoutes";
import Contact from "../Components/Contact";
import Welcome from '../Components/Welcome'
import ChatContainer from '../Components/ChartContainer'


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: white;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;


const Chat = () => {

  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  
  const User_storage = async ()=>{
    if(!localStorage.getItem('user')){
    navigate('/login')
    }else{
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem('user')
        )
      );
    }
  }

  useEffect(()=>{
   User_storage()
  },[])

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);


  const settingAvatar = async ()=>{
    if (currentUser) {
      if (currentUser.isAvaterImageSet) {
        const res = await axios.get(`${contactRouter}/${currentUser._id}`);
        setContacts(res.data);
      } else {
        navigate("/setAvatar");
      }
    }
  }

  //setting user
  useEffect(()=>{
   settingAvatar();
  },[currentUser])
  

  //
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
     <Container>
       <div className="container">
         <Contact contacts={contacts} changeChat={handleChatChange} />
         {currentChat === undefined ? (<Welcome />) : 
         (<ChatContainer currentChat={currentChat} socket={socket}/>)
         }
       </div>
     </Container>
    </>
  )
}

export default Chat
