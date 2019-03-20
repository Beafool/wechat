const rp = require('request-promise-native');
const { writeFile } = require('fs');

//发送请求、获取access_token，保存起来 设置过期时间

 async function getAccessToken() {
     const appId = 'wx2c17b4549dc57fad';
     const appSecret = '400069f2b854f13ffd9a6067bf051193';
    // 定义请求
      const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;
    //发送请求
     const result = await rp({method:'GET',url,json:true});
     //设置过期时间 2小时更新， 提前5分钟刷新
     result.expires_in = Date.now() + 7200000 - 300000;
     //保存为一个文件  -- > 只能保存字符串数据，将JS对象转换为json字符串
     writeFile('./accessToken.txt',JSON.stringify(result),err=>{

         if (!err) console.log('文件保存成功');
         else  console.log(err);

     })
     //返回获取好的access_token
     return result;
 }
 getAccessToken();