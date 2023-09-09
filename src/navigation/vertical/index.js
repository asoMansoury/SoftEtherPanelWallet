import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline';
import DownloadBoxOutline from 'mdi-material-ui/DownloadBoxOutline';
import AccountClock from 'mdi-material-ui/AccountClock';
import AccountMultiple from 'mdi-material-ui/AccountMultiple'
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
const navigation = () => {
  const {  data:session,status } = useSession(); 
  const [profileSelector,setProfileSelector] = useState({
    isLoggedIn:false
  });
  useEffect(async()=>{
    //var session =await getSession();
    if(status ==="authenticated"){
      setProfileSelector({
        email:session.user.email,
        isLoggedIn:true,
        isAgent:session.user.isAgent,
        isAdmin:session.user.isAdmin
      });
    }
  },[status]);
  var tmpMenues = [];


   
  if(profileSelector.isLoggedIn==true){
    tmpMenues.push({
      title: 'خرید اکانت اپن وی پی',
      icon: HomeOutline,
      path: '/OpenTunnel'
    });
    tmpMenues.push({
      title: 'خرید اکانت ایران',
      icon: HomeOutline,
      path: '/openvpn'
    });
    tmpMenues.push({
      title: 'خرید اکانت Cisco',
      icon: HomeOutline,
      path: '/cisco'
    });
    
    tmpMenues.push({
      title: 'تمدید اکانت',
      icon: AccountClock,
      path: '/cisco/revoke'
    });
    tmpMenues.push({
      title: 'تغییر سرور اکانت',
      icon: AccountPlusOutline,
      path: '/user/changeserver'
    })
    tmpMenues.push({
      sectionTitle: 'پنل کاربر'
    })
    if(profileSelector.isLoggedIn&&profileSelector.isAgent==true){
      tmpMenues.push(    {
        title: 'تعریف قیمت کاربران',
        icon: AccountCogOutline,
        path: '/agentprice'
      });
    }




    if(profileSelector.isLoggedIn&&profileSelector.isAgent==true){
      tmpMenues.push({
        title:"تعریف زیرمجموعه فروش",
        icon:AccountMultiple,
        path:'/agent/DefineNewAgent/'
      })
      
      tmpMenues.push({
        title: 'انتقال شارژ',
        icon: CreditCardOutline,
        path: '/agentmembership'
      });
      // tmpMenues.push({
      //   title: 'مشاهده صورت حساب',
      //   icon: CreditCardOutline,
      //   path: '/agent/billagent'
      // });
    }

  }

  if(profileSelector.isAdmin == true){
    tmpMenues.push({
      sectionTitle: 'پنل مدیریت'
    })
    tmpMenues.push({
      title: "تعریف نماینده فروش",
      icon: CubeOutline,
      path: '/admin/agents'
    })

    tmpMenues.push({
      title: 'ثبت تسویه حساب',
      icon: CubeOutline,
      path: '/admin/settlement'
    })
  }

  if(profileSelector.isLoggedIn==false){
    tmpMenues.push({
      sectionTitle: 'تغییر سرور اکانت'
    })
    tmpMenues.push({
      title: 'تغییر سرور اکانت',
      icon: HomeOutline,
      path: '/userfree/changeserver'
    });
  }


  tmpMenues.push({
    sectionTitle: 'اکانت تستی'
  })
  tmpMenues.push({
    title: 'اکانت تست OpenVPN',
    icon: HomeOutline,
    path: '/testaccounts/OpenTunnel'
  });

  tmpMenues.push({
    title: 'اکانت تست Cisco',
    icon: HomeOutline,
    path: '/testaccounts'
  });

  tmpMenues.push({
    title: 'اکانت تست ایران',
    icon: HomeOutline,
    path: '/testaccounts/iran'
  });
  tmpMenues.push({
    sectionTitle: 'نرم افزار'
  })
  tmpMenues.push({
    title: 'دانلود نرم افزار Cisco',
    icon: DownloadBoxOutline,
    path: '/Tutorial/Cisco/'
  });

  tmpMenues.push({
    title: 'دانلود نرم افزار OpenVpn ',
    icon: DownloadBoxOutline,
    path: '/Tutorial/OpenVpn'
  });

  tmpMenues.push({
    title: 'بخش آموزش ',
    icon: DownloadBoxOutline,
    path: '/Tutorial/Learning'
  });




  
  return tmpMenues;
}

export default navigation
