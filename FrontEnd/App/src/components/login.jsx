import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import './styles/login.css';
import { useState,useEffect } from "react";
import Axios from 'axios';
import {Link,Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import {useNavigate } from "react-router-dom"
import axios from 'axios';
axios.defaults.withCredentials = true

const cookies = new Cookies();
//class Counter extends Component {

function Connect(){

    const [Email,setemail] = useState("");
    const [password,setpassword] = useState("");
    const [error,seterror] = useState(false);
    
    const history = useNavigate ();
    
    const check1 = async ()=>{
        try{
            await axios.get('http://localhost:3001/users').then(res=>{
                if(res.status===200){
                    history("/home");
                }
            })
        }catch(err){
            //console.log(err);
            history("/login");
        }
    }

    useEffect(()=>{
         check1();
    },[]);


    const alerting = <Alert variant="danger"><strong>Invalid Email or Password</strong></Alert>;

    const check = (e)=>{
        e.preventDefault();
        seterror(false);
        Axios.post('http://localhost:3001/login',{Email,password}).then(res=>{
            console.log(res.data);
            if(res.data==="Invalid Email or Password"){
                seterror(true);
            }else{
               localStorage.setItem("id",res.data._id);
               localStorage.setItem("Email",res.data.Email);
               localStorage.setItem("name",res.data.name);
               axios.defaults.headers.common["id"]=res.data.token;
                history('/home');
            }
        })
    };

        return (
            <React.Fragment>
                <div className="Login-main">
                    <div className="intro-data">
                        <div className="logo">
                            <p>TEAM 3</p>
                        </div>
                        <div className="title">
                            <p>Network Data Monitoring App</p>
                        </div>
                        <div className="by">
                            <p>by: Ayushi Srivastava ,Bandi Pranathi, Karella Abhinava Chandrahasa Koushik</p>
                            <p>Navya Sree Pindi, Nihal Dulapalli, Shrey Shrivastava</p>
                        </div>
                    </div>
                <div className="Login-form">
                    <form onSubmit={check}>
                        <h2>Login</h2>
                        <label>Email</label>
                        <input type="email" className="form-control" onChange={(event)=>{setemail(event.target.value)}}></input>
                        <label>Password</label>
                        <input type="password" className="form-control" onChange={(event)=>{setpassword(event.target.value)}}></input>
                        {error ? alerting : null}
                        <div className="b">
                            <button type="submit"className="btn btn-primary">Login</button>
                            {/* <Link className="l" to="/register">Register</Link> */}
                        </div>
                    </form>
                </div>
                </div>
            </React.Fragment>
        );
}
 
export default Connect;