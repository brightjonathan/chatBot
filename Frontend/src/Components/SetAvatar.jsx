import {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { Buffer } from "buffer";
import loader from '../assets/loader.gif'
import {setAvatarRouter} from '../Utils/APIRoutes'




const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: white;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: black;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;



const SetAvatar = () => {

  //api for multiavater
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();

   //toastified styling
   const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };


  //for the avater and loading...
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);


  //calling the api 
  const dataInfor = async ()=>{
    const data = [];
    for(let i=0; i<4; i++){
      const image = await axios.get(`${api}/${Math.round(Math.random()* 1000)}`
      );
      const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
    };
    setAvatars(data);
    setIsloading(false)
  }

  //rendering it the browser
  useEffect(() =>{
    //if there is no localstorage return to login page
    if (!localStorage.getItem('user'))
    navigate("/login");

    dataInfor();

  },[])

  //profile pics functionality
  const setProfiilePics = async ()=>{
   if(selectedAvatar === undefined){
     toast.error('please select an avatar', toastOptions)
   }else{
     const _user = await JSON.parse(localStorage.getItem('user'));
     const response = await axios.post(`${setAvatarRouter}/${_user}`, {
       image: avatars[selectedAvatar],
     });
     
     //posting the avatar to the backend 
     if(response.data.isSet){
       _user.isAvaterImageSet = true;
       _user.avaterImage = response.data.image;
       localStorage.setItem('user', JSON.stringify(_user._id))
     }else{
       toast.error('error setting avatar, please try again', toastOptions)
     }
     navigate('/')
   }

  }
  
  return (
    <>

    {
      isLoading ? <Container>
        <img src={loader} alt='loader' className='loader' />
      </Container> : 
     <Container>
       <div className="title-container">
         <h1>
           pick an avater as profile picture
         </h1>
         <div className="avatars">
           {
             avatars.map((avatar, index)=>{ 
               return(
                 <div className={`avatar ${selectedAvatar === index ? "selected": ""}`} key={avatar} >
                   <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                 </div>
               )
             })
           }
         </div>
       </div>
       <button className='submit-btn' onClick={setProfiilePics}>Set as profile picture</button>
     </Container>
     }
     <ToastContainer/>
    </>
  )
}

export default SetAvatar

