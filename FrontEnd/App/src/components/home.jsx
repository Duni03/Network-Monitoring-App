import React, { Component, useEffect,useState } from 'react';
import './styles/home.css';
import axios from 'axios';
import { BsArrowDown, BsTypeH3 } from 'react-icons/bs';
import Chart from './chart';
import Badge from "react-bootstrap/Badge";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate ,Link} from 'react-router-dom';
axios.defaults.withCredentials = true


const Home = ()=>{
    
    const [red,setred]=useState([]);
    const [speed,setspeed]=useState("");
    const [rpm,setrpm]=useState(false);
    const [graphstate,setgraphstate] = useState(false);
    const [homegraph,sethomegraph] = useState([]);

    const history = useNavigate ();
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

        const t = false;
        
        const getres = async ()=>{
            try{
                await axios.get('http://localhost:3001/redmachine').then(res=>{
                    if(res.data){
                        setred(res.data);
                        console.log(res.data);
                    }
                })
            }
            catch(err){
                console.log(err);
            }
        }
        useEffect(()=>{
            getspeed();
            getres();
       },[]);

       const traffic = async ()=>{
        try{
            await axios.get('http://localhost:3001/traffic').then(res=>{
                if(res.data){
                    //console.log(res.data);
                    sethomegraph(res.data);
                    setgraphstate(!graphstate);
                }
            })
        }catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        traffic();
    },[graphstate]);

       const getspeed = async ()=>{
        try{
            await axios.get('http://localhost:3001/speedtest').then(res=>{
                if(res.data){
                    setspeed(res.data.speeddown.mbps);
                    console.log(res.data.speeddown.mbps);
                }
            })
        }
        catch(err){
            console.log(err);
        }
    }
    useEffect(()=>{
        getspeed();
   },[rpm]);

        // const auth = localStorage.getItem("id");
        const auth1 = axios.defaults.headers.common["id"];
        
//{user?ren:<Redirect to="/login" />}
       const redlist = (        
        <>
            {
                red.map((item,inx)=>{return (<><div key={inx}><h3>{item.MachineName}</h3><Button className="btn btn-primary" onClick={()=>{history("/machine/"+item._id)}}>Goto Machine</Button></div><br/></>)})     
            }

        </>
        );


        const ren = (<div className="home-back">
                        <div className='main-head'>
                        <Container>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <div className='main-head1'>
                                    <h1>Welcome {localStorage.getItem("name")},</h1><br/>
                                    <h3>Total Traffic</h3>
                                    <Chart dat={homegraph}/>
                                </div>
                            </Col>
                            <Col md="auto">
                                <div className='main-head2'>
                                    <Container>
                                        <Row>
                                            <Col>
                                            <h1>Speed</h1>
                                            </Col>
                                            <Col>
                                            <Button className='btn btn-primary' onClick={()=>{setrpm(!rpm)}}>Refresh</Button>
                                            </Col>
                                        </Row><br/>
                                        <Row>
                                            <Col>
                                            <h5>Download Speed</h5>
                                            <BsArrowDown size={33}/>
                                            </Col>
                                            <Col>
                                            <h2>{speed} mbps</h2>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </Col>
                        </Row><br/><br/><br/>
                        <Row className="justify-content-md-center">
                            <Col md="auto"><h1>Red List</h1></Col>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Col md="auto">
                                <div className='main-head3'>
                                    {red.length>0?redlist:<div><center><h3>No Red Machines</h3></center></div>}
                                </div>
                            </Col>
                        </Row>
                        </Container>
                    </div></div>);

        return (
            <React.Fragment>
                {ren}
            </React.Fragment>
        );
}
 
export default Home;

{/* <Navbar>
                            <Navbar.Brand href="#">RSUITE</Navbar.Brand>
                            <Nav>
                            <Nav.Item icon={<HomeIcon />}>Home</Nav.Item>
                            <Nav.Item>News</Nav.Item>
                            <Nav.Item>Products</Nav.Item>
                            <Nav.Menu title="About">
                                <Nav.Item>Company</Nav.Item>
                                <Nav.Item>Team</Nav.Item>
                                <Nav.Menu title="Contact">
                                <Nav.Item>Via email</Nav.Item>
                                <Nav.Item>Via telephone</Nav.Item>
                                </Nav.Menu>
                            </Nav.Menu>
                            </Nav>
                            <Nav pullRight>
                            <Nav.Item icon={<CogIcon />}>Settings</Nav.Item>
                            </Nav>
                        </Navbar> */}