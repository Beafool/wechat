/*
实现微信公众号提供的各个接口
*/
//菜单配置项
const rp = require('request-promise-native');
const fetchAccessToken = require('./access-token');

const menu = {
    "button":[
        {
            "type":"click",  // 单击菜单
            "name":"首页☀",
            "key":"home"
        },
        {
            "name":"黑凤梨💋",
            "sub_button":[
                {
                    "type":"view",  // 跳转到指定网址
                    "name":"官网",
                    "url":"https://www.baidu.com/"
                },
                {
                    "type": "scancode_waitmsg",
                    "name": "扫码带提示",
                    "key": "扫码带提示"
                },
                {
                    "type": "scancode_push",
                    "name": "扫码推事件",
                    "key": "扫码推事件"
                },
                {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图",
                    "key": "rselfmenu_1_0"
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "rselfmenu_1_1"
                },
            ]
        },
        {
            "name":"郑凤丽💋",
            "sub_button":[
                {
                    "type": "pic_weixin",
                    "name": "微信相册发图",
                    "key": "rselfmenu_1_2"
                },
                {
                    "name": "发送位置",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                }
            ]
        },
    ]
}
//微信创建菜单之前，必须将旧菜单删除掉
async function createMenu() {
    //获取access_token
    const { access_token } = await fetchAccessToken();
    // 定义请求的地址
    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
    //发送请求
   const  result = await rp({method:'POST',url,json:true,body:menu});

   return result;

}
async function deleteMenu() {
    //获取access_token
    const { access_token } = await fetchAccessToken();
    // 定义请求的地址
    const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`;
    //发送请求
    const  result = await rp({method:'GET',url,json:true});

    return result;

}
(async () => {
    let result = await deleteMenu();
    console.log(result);
    result = await createMenu();
    console.log(result);
})()