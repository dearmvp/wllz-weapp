//日期时间操作
module.exports = {
    isDate: {
        new_date: new Date(),
        year: new Date().getFullYear(), //当前年
        month: new Date().getMonth(), //当前月
        date: new Date().getDate(), //当前日
        day: new Date().getDay(), //今天本周的第几天
        tine: new Date().getTime(), //获取当前时间(从1970.1.1开始的毫秒数)  
        hours: new Date().getHours(), //获取当前小时数(0-23)  
        minutes: new Date().getMinutes(), //获取当前分钟数(0-59)  
        seconds: new Date().getSeconds(), //获取当前秒数(0-59)  
        milliseconds: new Date().getMilliseconds(), //获取当前毫秒数(0-999)  
        localeDateString: new Date().toLocaleDateString(), //获取当前日期  2024/1/11
        localeTimeString: new Date().toLocaleTimeString(), //获取当前时间  上午11:10:12
        localeString: new Date().toLocaleString(), //获取日期与时间  2024/1/11上午11:09:30
        //获取当前的日期
        currentDate() {
            return this.formatDate(new Date());
        },
        //获得本周的开端日期
        weekStartDate() {
            return this.formatDate(new Date(this.year, this.month, this.date - this.day));
        },
        //获得本周的停止日期
        weekEndDate() {
            return this.formatDate(new Date(this.year, this.month, this.date + (6 - this.day)));
        },
        //获得上周的停止日期
        weekLastEndDate() {
            return this.formatDate(new Date(this.year, this.month, this.date + (6 - this.day - 7)));
        },
        //获得本月的开端日期
        monthStartDate() {
            return this.formatDate(new Date(this.year, this.month, 1));
        },
        //获得本月的停止日期
        monthEndDate() {
            return this.formatDate(new Date(this.year, this.month, this.monthDays(this.month)));
        },
        //获得上月开端时候
        monthLastStartDate() {
            return this.formatDate(new Date(this.year, this.month - 1, 1));
        },
        //获得上月停止时候
        monthLastEndDate() {
            const day = new Date(this.year, this.month, 0).getDate();
            return this.formatDate(new Date(this.year, this.month - 1, day));
        },
        //获取今年的开头
        currentYear() {
            return this.new_date.getFullYear() + "-01-01";
        },
        //获取今天之前的多少天的日期
        DateCountDay(Day) {
            return this.formatDate(new Date().setDate(this.date + Day));
        },
        //获得某月的天数
        monthDays(month) {
            let StartDate = new Date(this.year, month, 1);
            let EndDate = new Date(this.year, month + 1, 1);
            return (StartDate - EndDate) / (1000 * 60 * 60 * 24);
        },
        //格局化日期：yyyy-MM-dd
        formatDate(date) {
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            if (m < 10) m = "0" + m;
            if (d < 10) d = "0" + d;
            return (y + "-" + m + "-" + d);
        },
        //字段拼接
        substrDataStr(date) {
            let strArr = [];
            strArr.push(date.substr(0, 4))
            strArr.push(date.substr(4, 2))
            strArr.push(date.substr(6, 2))
            return strArr
        },
        //格式化时间：yyyy-MM-dd HH:mm:ss
        formatTime(date) {
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const hour = date.getHours()
            const minute = date.getMinutes()
            const second = date.getSeconds()
            return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
        },
    },
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const getWeek = n => {
    switch (n) {
        case 1:
            return '星期一'
        case 2:
            return '星期二'
        case 3:
            return '星期三'
        case 4:
            return '星期四'
        case 5:
            return '星期五'
        case 6:
            return '星期六'
        case 0:
            return '星期日'
    }
}