/*
工具函数模块
*/
const { parseString ,} = require('xml2js');
module.exports={
    /*用来获取用户发送的消息*/
     getUserDataAsync (req){
        const xmlData= new Promise(((resolve, reject) => {
            let  xmlData= '';
            req
                .on('data',data => {
                    //console.log(data.toString())     //buffer数据 需要转换
                    xmlData+=data.toString();
                })
                .on('end', ( ) =>{
                    //说明数据接收完毕
                    resolve(xmlData);

                })

        }))
    },

    /**
     * 将xml数据解析为js对象
     * @param xmlData
     * @returns {jsData}
     */
    parseXMLData (xmlData){
        let jsData = null;
        parseString(xmlData,{trim:true},(err,result)=>{
            if(!err){
                jsData = result;
            }else{
                jsData = {};
            }

        })
        return jsData;
    },

    /**
     * 格式化js对象的方法
     * @param jsData
     * @return userData
     */
    formatJSData(jsData){
        const  {xml} = jsData;
        const userData = {};
        for(let key in xml){
            const value = xml[key];
            userData[key]=value[0];
        }
        return userData;
    }
}