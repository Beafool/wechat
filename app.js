const express = require('express');
const sha1 = require('sha1');
const { parseString } = require('xml2js');
const app = express();


app.use( async (req, res) => {
    //微信服务器发送过来的请求参数
    console.log(req.query);
    /*
      { signature: '1803ce659da462f08de2569a1d1cfd69e4be2997',   微信加密签名
      echostr: '4694387874978528247', 微信后台生成的随机字符串
      timestamp: '1552974353',  微信后台发送请求的时间戳
      nonce: '1754707196' }     微信后台生成的随机数字
     */


    const { signature, echostr, timestamp, nonce } = req.query;
    const token = 'heifengli1128';
    // 1）将token、timestamp、nonce三个参数进行字典序排序
    const sortedArr = [token, timestamp, nonce].sort();
   // console.log(sortedArr);
    // 2）将三个参数字符串拼接成一个字符串进行sha1加密
    const sha1Str = sha1(sortedArr.join(''));
    //console.log(sha1Str);

     if (req.method === 'GET') {
         // 3）开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
         if (sha1Str === signature) {
             // 说明消息来自于微信服务器
             res.send(echostr);
         } else {
             // 说明消息不是微信服务器
             res.end('error');
         }

     }else if(req.method === 'POST'){
         //用户发过来的消息
         // console.log(req.body); 通过中间件解析不了数据  需要使用其他方法

         //过滤掉不是微信服务器发送过来的消息  是就执行  不是就直接return
         if(sha1Str !== signature){
             res.end('error');
             return;
         }
         //获取到了用户发送过来的消息
       const xmlData=await new Promise(((resolve, reject) => {
            let  xmlData= '';
            req
                .on('data',data => {
                    //console.log(data.toString())     //buffer数据 需要转换
                    xmlData+=data.toString();
                    /*
                        <xml><ToUserName><![CDATA[gh_0b072a9c0251]]></ToUserName>  开发者微信测试号ID
                        <FromUserName><![CDATA[opI8M6BPGa21srvmQYAdCtOK21RA]]></FromUserName>  用户的openid
                        <CreateTime>1552993146</CreateTime>    发送消息的时间戳
                        <MsgType><![CDATA[text]]></MsgType>    发送消息的类型
                        <Content><![CDATA[ 222]]></Content>    发送消息的具体内容
                        <MsgId>22233512780598535</MsgId>   发送消息的id(默认保留三天，3天后销毁)
                        </xml>
                    */
                })
                .on('end', ( ) =>{
                //说明数据接收完毕
                resolve(xmlData);

            })

        }))

        //将xml数据转化成js对象
        let jsData = null;
       /*{ xml:
            { ToUserName: [ 'gh_0b072a9c0251' ],
             FromUserName: [ 'opI8M6BPGa21srvmQYAdCtOK21RA' ],
             CreateTime: [ '1552994384' ],
             MsgType: [ 'text' ],
             Content: [ '444' ],
             MsgId: [ '22233530558045794' ] } }

             --》把上面的换成下面的样子   首先提取xml 得到后面的对象 ，然后将对象中每一个属性的的值数组去掉（提取数组中的第一项的值，然后赋值给他）
             { xml:
               {ToUserName: 'gh_0b072a9c0251' ,
                 FromUserName: 'opI8M6BPGa21srvmQYAdCtOK21RA' ,
                 CreateTime: '1552994384' ,
                 MsgType: 'text' ,
                 Content: '444' ,
                 MsgId: '22233530558045794'  }

*/
        const result=parseString(xmlData,{trim:true},(err,result)=>{    //字符串调trim 能去除首尾两个空格
            if(!err){
               // return result   没有用，不是想要的结果
                jsData = result;
            }else{
                jsData = {};
            }

         })
         //格式化jsData
         const  {xml} = jsData;//把xml的值 从json中拿出来
         let userData = {};
            for(let key in xml){  //对象没有itruter 接口 所以用不了 for....of  对象只能用for  in
                //获取到属性值
                const value = xml[key];
                //去掉数组
                userData[key]=value[0];
            }
            console.log(userData);

        //  实现自动回复
         let  content = '请说普通话';
         if(userData.Content === '1' ){
             content = '床前明月光';
         }else if (userData.Content.indexOf('2') !== -1){
             content = '你今天把我害惨了 \n \n \n 害我那么喜欢你';
         }
         let replyMessage=`<xml>
              <ToUserName><![CDATA[${userData.FromUserName }]]></ToUserName>
              <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
              <CreateTime>${Date.now()}</CreateTime>
              <MsgType><![CDATA[text]]></MsgType>
              <Content><![CDATA[${content}]]></Content>
            </xml>`

         //返回响应
         res.send(replyMessage);


     }else {
         res.end('error')
     }





})

app.listen(3000, err => {
    if (!err) {
        console.log('服务器启动成功了~');
    } else {
        console.log(err);
    }
})