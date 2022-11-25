const express = require("express");
const userModel = require("../models/models.js");
const machineModel = require("../models/machine.js");
const domainModel = require("../models/domain.js");
const trafficModel = require("../models/traffic.js");
const cookieParser = require("cookie-parser");
const find = require('local-devices');
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const authing = require("./authing.js");

const NetworkSpeed = require('network-speed');  // ES5
const testNetworkSpeed = new NetworkSpeed();

var ping = require("ping");
async function stat(ipp){
  let msg = (await ping.promise.probe(ipp)).alive;
    return msg;
  };



////////////////////////////////////////////////////////////////////////////////////////

const jwt = require("jsonwebtoken");
const app = express();

////////////////////////////////////////////////////////////////////////////////////////

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

///////////////////////////////// LOGIN ROUTES ///////////////////////////////////////////////////////

app.post("/register", async (request, response) => {
  console.log(request.body);
  var n = await userModel.findOne({ Email: request.body.Email });
  if (n) {
    response.send("Email already exists");
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(request.body.password, salt);
      request.body.password = hashedPassword;
      const user = new userModel(request.body);
      await user.save((err) => {
        if (err) {
          response.send(err);
        } else {
          response.send("Successfully registered");
        }
      });
      console.log(user);
    } catch (err) {
      console.log(err);
    }
  }
});

app.post("/login", async (request, response) => {
  try {
    var n = await userModel.findOne({ Email: request.body.Email });
    if (!n || !(await bcrypt.compare(request.body.password, n.password))) {
      response.send("Invalid Email or Password");
    } else {
      var token = jwt.sign({ Email: n.Email, _id: n._id }, "<Enter your secret>", {
        expiresIn: "1h",
      });
      // response.status(200).json({"Email":n.Email,_id: n._id,"token":token});
      response
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        })
        .json({ Email: n.Email, _id: n._id, name: n.FirstName });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/users", authing, async (request, response, next) => {
  console.log("protected route");
  response.send("this is from protected route");
});

// console.log(request.cookies["token"]);
//     try {
//       if(!request.cookies["token"]){
//         throw new Error("Unauthorized");
//     ``}
//       const t = jwt.verify(request.cookies["token"], "<Enter Your Secret>");
//       console.log(t);
//       var n =await userModel.findOne({ _id: t._id});
//       if(n){
//         try {
//           console.log(request.cookies["token"]);
//           response.send("Authorized");
//         } catch (error) {
//           response.status(401).send(error);
//         }
//       }
//     }
//     catch (error) {
//       response.status(401).send(error);
//     }

app.post("/getuser", async (request, response) => {
  console.log(request.body);
  var n = await userModel.findOne({ Email: request.body.Email });
  console.log(n);
  e={
    FirstName:n.FirstName,
    SecondName:n.SecondName,
    Email:n.Email,
    _id:n._id
  }
  response.send(e);
})

app.post("/edituser", async (request, response) => {
  try {
    const data = await userModel.findByIdAndUpdate(
      request.body.id,
      request.body,
      {
        new: true,
      }
    );
    console.log(request.body.id);
    response.send(data);
  } catch (err) {
    response.send("Error " + err);
  }
});

// app.post("/register", async (request, response) => {
//   console.log(request.body);
//   var n = await userModel.findOne({ Email: request.body.Email });
//   if (n) {
//     response.send("Email already exists");
//   } else {
//     try {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(request.body.password, salt);
//       request.body.password = hashedPassword;
//       const user = new userModel(request.body);
//       await user.save((err) => {
//         if (err) {
//           response.send(err);
//         } else {
//           response.send("Successfully registered");
//         }
//       });
//       console.log(user);
//     } catch (err) {
//       console.log(err);
//     }
//   }
// });

app.post("/changePassword", async (request, response) => {
  try {
    var n = await userModel.findOne({ _id: request.body._id });
    console.log(n);
    if (!n || !(await bcrypt.compare(request.body.password, n.password))) {response.send("Password not changed");}
    else{
      console.log("test")
    const salt = await bcrypt.genSalt(10);
    console.log(request.body);
    const hashedPassword = await bcrypt.hash(request.body.newpassword, salt);
    console.log(hashedPassword);
    const data = await userModel.findByIdAndUpdate(request.body._id,{"password":hashedPassword});
    if(data){
      console.log(data);
      response.send("Password Changed");
    }
    else{
      response.send("Password not changed");
    }}
  } catch (err) {
    response.send("Error " + err);
  }

});

///////////////////////////////// NETSPEED  ///////////////////////////////////////////////////////

app.get("/speedtest", async (request, response) => {
  try{
    const baseUrl = 'https://eu.httpbin.org/stream-bytes/500000';
  const fileSizeInBytes = 5000000;
  const speeddown = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);
  console.log(speeddown);
    const options = {
      hostname: 'www.yahoo.com',
      port: 80,
      path: './',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const fileSizeInBytes1 = 500000
    // const speedup = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes1);
    // console.log(speedup);
    response.send({speeddown});
  }
  catch (err) {
    console.log(err);
    response.send("Error abba" + err);
  }
})

app.get("/traffic",async (request,response)=>{
  try{
    // const user = new trafficModel(request.body);
    // await user.save((err) => {
    //   if (err) {
    //     response.send(err);
    //   } else {
    //     response.send("Successfully registered");
    //   }
    // });
    var s=0;
    var p1 =0;
    const data = await machineModel.find();
    for(var i of data){
      s=s+i.daily.packetssent;
      p1=p1+i.daily.packetrecived;
    }
    ans = [
      {
        name: "Sent Packets",
        p: s,
      },
      {
        name: "Received Packets",
        p: p1,
      },
      {
        name: "Total Packets",
        p: s+p1,
      }
    ];
    response.status(200).send(ans);
  }
  catch(err){
    console.log(err);
  }
})


////////////////////////////////////////// MACHINE ROUTE //////////////////////////////////////////////

app.get("/localdevices", async (request, response) => {
  const data = [];
  try {
    find({ address: '0.0.0.0-255.255.255.254' }).then(devices => {
      console.log(devices); 
      data.push(devices);
      response.send(devices);
    })
  } catch (err) {
    response.send("Error " + err);
  }
})

app.post("/register-machine", async (request, response) => {
  console.log(request.body);
  var n = await machineModel.findOne({ Machineip: request.body.Machineip,Machinemac:request.body.Machinemac });
  if (n) {
    response.send("Machine already exists");
  } else {
    try {
      const machine = new machineModel(request.body);
      await machine.save((err) => {
        if (err) {
          response.send(err);
        } else {
          response.send("Successfully registered Machine");
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
});

app.get("/machines", async (request, response) => {
  try {
    const data = await machineModel.find();
    var msg = [];
    var temp = {};
    for (let i of data) {
      let Status = await stat(i.Machineip)? "Online" : "Offline";
      console.log(Status);
      console.log(i.Machineip);
      temp = {
        _id: i._id,
        MachineName: i.MachineName,
        Machineip: i.Machineip,
        Machinemac: i.Machinemac,
        MachineEmail: i.MachineEmail,
        Status: Status,
      };
      msg.push(temp);
    }
    response.send(msg);
  } catch (err) {
    response.send("Error " + err);
  }
});

app.get("/redmachine", async (request, response) => {
    var msg = [];
    console.log(typeof(msg));
    var temp = {};
  try{
    const data = await machineModel.find({red:true});
    if(!data){
      response.send("No Machine");
    }
    for(let i of data){
        temp = {
          _id: i._id,
          MachineName: i.MachineName,
        }
        msg.push(temp);
    }
    console.log(typeof(msg));
    response.send(msg);
  }
  catch(err){
    response.send("Error " + err);
  }
})

app.post("/getmachine", async (request, response) => {
  try {
    // console.log(request.body.id);
    const data = await machineModel.findById(request.body.id);
    const list = await domainModel.find();
    var msg = [];
    var count = 0;
    let Status = await stat(data.Machineip)? "Online" : "Offline";
    for(var i of data.domain){
      var x = i;
      var t = list.find((x)=>x.Domain==i);
      v=t?{[x]:"Allowed"}:{[x]:"Not Allowed"};
      msg.push(v);
      if(!t){
        count++;
      }
      // msg = Object.assign(v, msg)
    } 
    if(count>8){
      const upcount = await machineModel.findByIdAndUpdate(request.body.id,{"red":true});
    }
    // console.log(msg);
    e={
      _id: data._id,
      MachineName: data.MachineName,
      Machineip: data.Machineip,
      Machinemac: data.Machinemac,
      MachineEmail: data.MachineEmail,
      domain: data.domain,
      daily: data.daily,
      weekly: data.weekly,
      monthly: data.monthly,
      t:msg,
      Status: Status,
      count:count
    };
    //console.log(e);
    response.send(e);
    if (!data) {
      response.status(401).send("Machine not found");
    }
  } catch (err) {
    response.send("Error " + err);
  }
});

app.patch("/updatemachine", async (request, response) => {
  try {
    const data = await machineModel.findByIdAndUpdate(
      request.body.id,
      request.body,
      {
        new: true,
      }
    );
    console.log(data);
    response.send(data);
  } catch (err) {
    response.send("Error " + err);
  }
})

app.delete("/delete-machine/:id", async (request, response) => {
  try {
    const data = await machineModel.findByIdAndDelete(request.params.id);
    response.send(data);
  } catch (err) {
    response.send("Error " + err);
  }
});

app.post("/sendemail", async (request, response) => {
  try{
    const mesg = {
      from: "randomuser2205@gmail.com",
      to: request.body.email,
      subject: "warning",
      text: request.body.msg,
    };
    
    nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "<Give Your Email>",
          pass: "Give 2 Auth Key",
        },
        port: 465,
        host: "smtp.gmail.com",
      }).sendMail(mesg, (error) => {
        console.log("email sent");
        if (error) {
          console.log(error);
        }
        else{
          response.send("Email sent");
        }
      });    
  }
  catch(err){
    response.send("Error " + err);
  }
})

///////////////////////////////////// DOMAIN ROUTES ///////////////////////////////////////////////////

app.post("/register-domain", async (request, response) => {
  console.log(request.body);
  var n = await domainModel.findOne({ Domain: request.body.Domain });
  if (n) {
    response.send("Domain already exists");
  } else {
    try {
      const domain = new domainModel(request.body);
      await domain.save((err) => {
        if (err) {
          response.send(err);
        } else {
          response.send("Successfully registered domain");
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
});

app.get("/domain", async (request, response) => {
  try {
    const data = await domainModel.find();
    var e = data.map((obj) => {
      return {
        Domain: obj.Domain,
        //id:obj._id
      };
    });
    response.send(data);
  } catch (err) {
    response.send("Error " + err);
  }
});

app.delete("/delete-domain/:id", async (request, response) => {
  try {
    const data = await domainModel.findByIdAndDelete(request.params.id);
    response.send(data);
  } catch (err) {
    response.send("Error " + err);
  }
});

////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// LOGOUT ROUTE ///////////////////////////////////////////////////

app.post("/logout", async (request, response) => {
  response.clearCookie("token");
  response.send("logged out");
});

module.exports = app;
