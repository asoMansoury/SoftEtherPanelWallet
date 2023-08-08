
var axios = require('axios');
var qs = require('qs');


export async function CreateToken(uuid,amount,callbackUrl){
    var data = qs.stringify({
        'api_key': 'b11ee9c3-d23d-414e-8b6e-f2370baac97b',
        'amount': `'${amount}'`,
        'order_id': uuid,
        'callback_uri': callbackUrl 
        });

        var config = {
          method: 'post',
          url: 'https://nextpay.org/nx/gateway/token',
          data : data
        };
        
        await axios(config).then(function (response) {
          return JSON.stringify(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
        
}


export async function VerifyingPayment(trans_id,amount){
  var data = qs.stringify({
      'api_key': 'b11ee9c3-d23d-414e-8b6e-f2370baac97b',
      'amount': amount,
      'trans_id': trans_id
      });
      
      var config = {
        method: 'post',
        url: 'https://nextpay.org/nx/gateway/verify',
        data : data
      };
      
      await axios(config).then(function (response) {
        return JSON.stringify(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      
}




