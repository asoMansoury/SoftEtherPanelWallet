import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid'
import {Card} from "@mui/material";

const itemStyle = {
  marginBottom: '16px',
};

const buttonStyle = {
  backgroundColor: '#2196f3',
  color: '#fff',
  padding: '8px 16px',
  textDecoration: 'none',
  display: 'inline-block',
  borderRadius: '4px',
};


const TutorialComponent = (props)=>{
    const router = useRouter();
    const [servers,setServers] = useState([]);
    const [users,setUsers] = useState([]);
    const [activatedServers,setActivatedServers] = useState([]);

    
    useEffect(()=>{
      setUsers(props.users);
      setServers(props.servers);
      selectActivatedServers();
    },[props]);

    function selectActivatedServers(){
      var selectedServer = [];
      if(users.length>0 && servers.length>0){
        users.map((userItem,userIndex)=>{
          const serverCode = userItem.serverId.filter(server => server.policy !== "D1").map(server => server.servercode);
          if(serverCode.length > 0){
            serverCode.map((itemCode,indexCode)=>{
              selectedServer.push(servers.filter(server => server.servercode === itemCode)[0]);
            })
          }
        });
        setActivatedServers(selectedServer);
      }
    }

    return   (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card style={{marg:'auto'}}>
            {
              (activatedServers && activatedServers.length>0)&&
                <div style={{minWidth:100,display: 'flex',justifyContent:'center', justifyItems:'center'}}>
                  <span>لینک دانلود فایل کانفیگ ovpn</span>
                  {
                    <div style={containerStyle}>
                      {activatedServers.map((itemServer, index) => (
                        <div key={index} style={itemStyle}>
                          <a href={itemServer.ovpnurl} target="_blank" rel="noreferrer" style={buttonStyle}>
                            دانلود فایل
                          </a>
                        </div>
                      ))}
                    </div>
                  }
                </div>
            }
          </Card>
        </Grid>
      </Grid>
    )
}

export default TutorialComponent;