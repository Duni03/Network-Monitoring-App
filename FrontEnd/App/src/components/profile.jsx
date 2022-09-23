import React, { Component, useEffect,useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate ,Link} from 'react-router-dom';
import axios from 'axios';
import './styles/profile.css';



const Profile = () => {

    const history = useNavigate ();

    const [user,setuser] = useState([]);
    const [edit,setedit] = useState(false);
    const [name,setname] = useState("");
    const [email,setemail] = useState("");
    const [sname,setsname] = useState("");
    const [id,setid] = useState("");
    const [ajax,setajax] = useState(false);

        const check = async ()=>{
            try{
                await axios.get('http://localhost:3001/users').then(res=>{
                    if(!res.status===200){
                        const error = new Error(res.error);
                        throw error;
                    }
                })
            }catch(err){
                //console.log(err);
                history("/login");
            }
        }
        useEffect(()=>{
             check();
        },[]);

    
    const getu = async ()=>{
        try{
            await axios.post('http://localhost:3001/getuser',{Email:localStorage.getItem("Email")}).then(res=>{
                if(res.data){
                    console.log(res.data);
                    setuser(res.data);
                    setname(res.data.FirstName);
                    setsname(res.data.SecondName);
                    setemail(res.data.Email);
                    setid(res.data._id);
                }
            })
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getu();
   },[ajax]);

   
   

   const edituser = async ()=>{
        try{
            await axios.post('http://localhost:3001/edituser',{id:id,FirstName:name,SecondName:sname,Email:email}).then(res=>{
                if(res.data){
                    console.log(res.data);
                    setuser(res.data);
                    setname(res.data.FirstName);
                    localStorage.removeItem("name");
                    localStorage.setItem("name",res.data.FirstName);
                    setsname(res.data.SecondName);
                    setemail(res.data.Email);
                    localStorage.removeItem("Email");
                    localStorage.setItem("Email",res.data.Email);
                    setajax(!ajax);
                }
            })
        }
        catch(err){
            console.log(err);
        }
   }

   const editform = ()=>{
        return(
            <>
                <Container>
                    <Row>
                        <Col><label>First Name</label><input className="form-control" type="text" value={name} onChange={(e)=>{setname(e.target.value)}} required></input></Col>
                        <Col><label>Last Name</label><input className="form-control" type="text" value={sname} onChange={(e)=>{setsname(e.target.value)}} required></input></Col>
                        <Col><label>Email</label><input className="form-control" type="text" value={email} onChange={(e)=>{setemail(e.target.value)}} required></input></Col>
                    </Row>
                </Container>
            </>
        );
   }

    return (
        <>
        <div className='profile'>
        <div className='profile-head'>
            <center>
        <h1>Profile</h1></center>
        <div className="user-details">
        <Container>
            <Row>
                <Col>
                    <div className="user-details-left">
                        <Container>
                        <Row><Col><h4> First Name : </h4></Col><Col><h3> {user.FirstName}</h3></Col></Row><br/>
                        <Row> <Col><h4> Last Name : </h4></Col><Col><h3>{user.SecondName}</h3></Col></Row><br/>
                        <Row>  <Col><h4> Email : </h4></Col><Col><h3>{user.Email}</h3></Col></Row><br/>
                        <Row>
                            {edit?<Col><Button className='btn btn-primary' type="submit" onClick={()=>{setedit(false);edituser();}}>Save</Button>{' '}<Button className='btn btn-primary' onClick={()=>{setedit(false)}}>Cancel</Button></Col>:<Col><Button className='btn btn-primary' onClick={()=>{setedit(true)}}>Edit</Button></Col>}
                        </Row>
                        </Container><br/>
                        {edit?editform():null}
                    </div>
                </Col>
                <Col>
                    <div className="new-user">
                        <h4>Register New User</h4><br/>
                        <Button className='btn btn-primary' onClick={()=>{history("/register")}}>Register</Button>
                    </div>
                </Col>
            </Row>
        </Container>
            <br/>
        
        </div>
        </div>
        </div>
        </>
    );
}

export default Profile;