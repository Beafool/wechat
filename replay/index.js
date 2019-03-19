
/*
    中间件函数模块
*/
const sha1 = require('sha1');
const { getUserDataAsync,parseXMLData,formatJSData}=require('../utils/tools');
module.exports= () =>{
    return async (req, res) => {
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
        //const sortedArr = [token, timestamp, nonce].sort();
        // console.log(sortedArr);
        // 2）将三个参数字符串拼接成一个字符串进行sha1加密
        //const sha1Str = sha1(sortedArr.join(''));
        //console.log(sha1Str);

        const sha1Str = sha1([token, timestamp, nonce].sort().join(''));
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
            const xmlData = await getUserDataAsync(req);

            //将xml数据转化成js对象
            const jsData = parseXMLData(xmlData);

            //格式化jsData
            const userData = formatJSData(jsData);

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

    }
}