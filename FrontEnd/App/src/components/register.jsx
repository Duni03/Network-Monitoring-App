import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import './styles/register.css';
import { useState,useEffect } from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
import {useNavigate } from "react-router-dom"



const Register = ()=>{

    const history = useNavigate ();
        const check = async ()=>{
            try{
                await axios.get('http://localhost:3001/users').then(res=>{
                    if(!res.status===200){
                        const error = new Error(res.error);
                        throw error;
                    }
                    history("/register");
                })
            }catch(err){
                //console.log(err);
                history("/login");
            }
        }
        useEffect(()=>{
             check();
        },[]);
    
    const [Email,setEmail] = useState("");
    const [password,setpassword] = useState("");
    const [confirmpassword,setconfirmpassword] = useState("");
    const [FirstName,setFirstname] = useState("");
    const [SecondName,setSecondname] = useState("");

    const [error,seterror] = useState(false);
    const [done,setdone] = useState(false);
    const [account,setaccount] = useState(false);
    const [fields,setfields] = useState(false);

    const routeChange = () =>{ 
        let path = "/profile"; 
        history(path);
    }

    const alerting = <Alert variant="danger"><strong>Passwords do not match</strong></Alert>;
    const alerting2 = <Alert variant="danger"><strong>Email already exists</strong></Alert>;
    const alerting3 = ( <div>
                            <Alert variant="success"><strong>User registered</strong></Alert>
                            <div className="b">
                                <button className="btn btn-primary" onClick={routeChange}>Profile</button>
                                {/* <Link to="/login">Login</Link> */}
                            </div>
                        </div>
                        );

    const alerting4 = <Alert variant="danger"><strong>Fill in all fields</strong></Alert>;

    

    const add = (e)=>{
        e.preventDefault();
        if(FirstName === "" || SecondName === "" || Email === "" || password === "" || confirmpassword === ""){
            setfields(true);
            seterror(false);
            setdone(false);
            setaccount(false);
        }
        else{
            if(password===confirmpassword){
                setfields(false);
                seterror(false);
            axios.post('http://localhost:3001/register',{FirstName,SecondName,Email,password}).then(res=>{
                if(res.data==="Email already exists"){
                    console.log(res.data);
                    setdone(true);
                }else{
                    setaccount(true);
                }
            })
            }
            else{
                seterror(true);
            }
        }
        
    };

    const mainForm = (
        <form onSubmit={add}>
            <h2>Register</h2>
            <label>First Name</label>
            <input type="text" className="form-control" autoComplete="on" onChange={(event)=>{setFirstname(event.target.value)}}></input>
            <label>Last Name</label>
            <input type="text" className="form-control" autoComplete="on"  onChange={(event)=>{setSecondname(event.target.value)}}></input>
            <label>Email</label>
            <input type="email" className="form-control"  onChange={(event)=>{setEmail(event.target.value)}}></input>
            <label>Password</label>
            <input type="password" className="form-control" onChange={(event)=>{setpassword(event.target.value)}}></input>
            <label>Confirm Password</label>
            <input type="password" className="form-control" onChange={(event)=>{setconfirmpassword(event.target.value)}}></input>
            {error ? alerting : null}
            {done ? alerting2 : null}
            {fields ? alerting4 : null}
            <div className="b">
                <button className="btn btn-primary">Register</button>
            </div>
        </form>);

        return (
            <React.Fragment>
                <div className="mb-3">
                    {account ? alerting3 : mainForm}
                </div>
            </React.Fragment>
        );
}
 
export default Register;