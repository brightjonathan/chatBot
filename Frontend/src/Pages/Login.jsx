import {useEffect, useState} from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from  'validator'
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios'
import { loginRouter } from '../Utils/APIRoutes';


const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: white;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: black;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid  #9ebdd9;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
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
  span {
    color: white;
    //text-transform: lowerCase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;





const Login = () => {

  const navigate = useNavigate();

  //toastified styling
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

   //if there is a user in the localstorege it should re-direct to the home page
  useEffect(() => {
    if (localStorage.getItem('user')) {
      navigate("/");
    }
  }, []);


 //values
 const [values, setValues] = useState({
  email: "",
  password: "",

})

const handleChange = (e)=>{
  setValues({...values,[e.target.name]: e.target.value})
 }

  //handling validation
  const handleValidation = () => {
    const { password, email } = values;

   if (password.length <= 6) {
      toast.error(
        "Password must be greater than six characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (!validator.isEmail(email)) {
      toast.error("Enter valid email", toastOptions);
      return false;
    }

    return true;
  };

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, password } = values;
      const response = await axios.post(loginRouter, {
        email,
        password,
      });
      if (!response.data) {
        toast.error(response.data.msg, toastOptions);
      }
      if (response.data) {
        localStorage.setItem(
          'user',
          JSON.stringify(response.data)
        );
      }
      navigate("/");
    }
  };
 


  return (
    <>
      <FormContainer>
      <form action="" onSubmit={(event) => handleSubmit(event)}>
        <div className="brand">
          <img src={Logo} alt="logo" />
          <h1>snappy Chat</h1>
        </div>
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => handleChange(e)}
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={(e) => handleChange(e)}
        />
       
        <button type="submit"> login </button>
        <span>
          Don't have an acconnt? <Link to="/register">Register</Link>
        </span>
      </form>
      </FormContainer>
       <ToastContainer/>
    </>
  )
}

export default Login
