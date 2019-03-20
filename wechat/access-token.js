const rp = require('request-promise-native');
const { writeFile,readFile } = require('fs');


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

//得到最终有效的access_token

function fetchAccessToken() {
   return new Promise((resolve, reject) => {
        readFile('./accessToken.txt',(err,data) => {
            if (!err){
                //说明有文件
                resolve(JSON.parse(data.toString()));
            }else {
                //说明没有文件
                reject(err);
            }
        })

    })
       //内部箭头函数的返回值  就是 then  /  catch函数的返回值
       //返回值如果是Promise , 就不处理  如果不是 ， 就会包一层promise返回
        .then(res =>{
            console.log(res);
            //判断有没有过期
            if (res.expires_in < Date.now()){
                //过期了
                //  promise 内部有 access_token
             return getAccessToken();
            } else {
                //没有过期
                return res;
            }
        })
        .catch(err =>{
           //正常的错误
           //  promise 内部有 access_token
            return getAccessToken();

        })

}
/*(async ()=>{
    const result = fetchAccessToken();
    console.log(result)

})()*/
