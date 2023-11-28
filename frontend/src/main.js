//
import './assets/css/app.css';
//
import {Greet} from '../wailsjs/go/main/App';
import {BrowserOpenURL} from "../wailsjs/runtime";
// wails-js全局方法。桥接方法。
window.wailsJS = {
    log: (where, info) => {
        console.log(where+"\n", info?info:"");
    },
    error: (where, info) => {
        console.log(where+"\n", info?info:"");
    },
    makeDate: function (date_time){ // YmdHisW，日期周
        let t = new Date();
        let seconds = t.getSeconds(); if (seconds<10){seconds = "0"+seconds;}
        let minutes = t.getMinutes(); if (minutes<10){minutes = "0"+minutes;}
        let hour = t.getHours(); if (hour<10){hour = "0"+hour;}
        let day = t.getDate(); if (day<10){day = "0"+day;}
        let month = t.getMonth() + 1; if (month<10){month = "0"+month;}
        let year = t.getFullYear();
        let week = ["Seven", "One", "Two", "Three", "Four", "Five", "Six"][t.getDay()]; // 周
        date_time = date_time.replaceAll("Y", year);
        date_time = date_time.replaceAll("m", month);
        date_time = date_time.replaceAll("d", day);
        date_time = date_time.replaceAll("H", hour);
        date_time = date_time.replaceAll("i", minutes);
        date_time = date_time.replaceAll("s", seconds);
        date_time = date_time.replaceAll("W", week);
        return date_time;
    },
    is_wails: ()=> { // 判断是否在wails框架中
        let url = window.location.host;
        return (url.toLowerCase().indexOf("wails") !== -1);
    },
    window_open: (url)=> { // 使用默认浏览器打开链接
        let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)+([A-Za-z0-9-~\/])/;
        if (reg.test(url)){
            BrowserOpenURL(url); // 注意，启动此函数需要完整的网址（如http、https开头的）
        }else{
            console.log("启动此函数需要完整的网址（如http、https开头的）：", url);
        }
    },
};

//
function AppRun(){
    window.wailsJS.log("AppRun", window.wailsJS.makeDate("YmdHis"));
}
AppRun();