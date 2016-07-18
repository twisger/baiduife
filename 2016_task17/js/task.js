// 数据格式演示
// var aqiSourceData = {
//     '北京': {
//         '2016-01-01': 10,
//         '2016-01-02': 10,
//         '2016-01-03': 10,
//         '2016-01-04': 10,
//     }
// };

//以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m =  dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date('2016-01-01');
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    '北京': randomBuildData(500),
    '上海': randomBuildData(300),
    '广州': randomBuildData(200),
    '深圳': randomBuildData(100),
    '成都': randomBuildData(300),
    '西安': randomBuildData(400),
    '福州': randomBuildData(100),
    '厦门': randomBuildData(100),
    '沈阳': randomBuildData(500),
};
// 用于渲染图表的数据
var chartData = {
    commonWidth: 0,
    detail: {}
};

//记录当前页面的表单选项
var pageState = {
    nowSelectCity: '',
    nowGraTime: 'day'
};

// 根据页面状态设置图表所需数据
function setData() {
    var city = pageState.nowSelectCity;
    var gra = pageState.nowGraTime;
    //首先获取各城市数据
    var data = aqiSourceData[city];
    // 然后根据条件进一步处理
    switch (gra) {
        case 'day': 
            chartData.commonWidth = 9;
            chartData.detail = getData.getDayData(data);
            break;
        case 'week': 
            chartData.commonWidth = 80;
            chartData.detail = getData.getWeekData(data);
            break;
        case 'month':
            chartData.commonWidth = 200;
            chartData.detail = getData.getMonthData(data);
            break;
        default:
            alert('graTimeError!');
    }
}

// 获取渲染所需颜色
function getColor(aqiNum) {
    var color = 255 - aqiNum * (255/500);
    color = parseInt(color, 10).toString(16);
    //颜色修正，如#bbb至#0b0b0b。
    if (color.length === 1) {
        color = '0' + color;
    }
    color = color = '#' + color + color + color;
    return color;
}

// 渲染图表
function renderChart() {
    var width = chartData.commonWidth + 'px';
    var detail = chartData.detail;
    var color = '';
    var styleStr = '';
    var chartStr = '';
    for (var time in detail) {
        if (detail.hasOwnProperty(time)) {
            color = getColor(detail[time]);
            height = detail[time] + 'px';
            styleStr = '"display: inline-block' + '; ' + 'width: ' + width + '; ' + 'height: ' + height + '; ' + 'background-color: ' + color + '; "';
            chartStr += '<div style=' + styleStr + ' title="' + time + ' 空气质量：' + detail[time] + '"' + '">' + "</div>";
        }
    }
    document.getElementById('aqiChartWrap').innerHTML = chartStr;
}
// 根据粒度返回用于渲染的新数据对象
var getData = {
    getDayData: function(data) {
        var result = {};
        for (var time in data) {
            if (data.hasOwnProperty(time)) {
                result[time] = data[time];
            }
        }
        return result;
    },
    getWeekData: function(data) {
        var aqiSum = 0;
        var aqiAve = 0;
        var count = 0;
        var timeStr = '';
        var result = {};
        var startDat = new Date('2016-01-01');
        var nowDat = new Date('2016-01-01');
        for (var time in data) {
            if (data.hasOwnProperty(time)) {
                aqiSum += data[time];
                count++;
                nowDat = new Date(time);
                if (nowDat.getDay() === 0) {
                    timeStr = getDateStr(startDat) + '~' + getDateStr(nowDat);
                    aqiAve = parseInt(aqiSum / count, 10);
                    result[timeStr] = aqiAve;
                    aqiSum = 0;
                    count = 0;
                    startDat = nowDat;
                    startDat.setDate(nowDat.getDate() + 1);
                }
            }
        }
        //最后一天不是星期天时
        if (nowDat.getDay() !== 0) { 
            aqiAve = parseInt(aqiSum / count, 10);
            timeStr = getDateStr(startDat) + '~' + getDateStr(nowDat);
            result[timeStr] = aqiAve;
        }
        return result;
    },
    getMonthData: function(data) {
        var aqiSum = 0; 
        var aqiAve = 0;
        var count = 0;
        var timeStr = '';
        var result = {};
        var startDat = new Date('2016-01-01');
        for (var time in data) {
            if (data.hasOwnProperty(time)) {
                var nowDat = new Date(time);
                var nextDay = new Date(time);
                nextDay.setDate(nextDay.getDate() + 1);
                aqiSum += data[time];
                count++;
                if (nowDat.getMonth() !== nextDay.getMonth()) {
                    timeStr = getDateStr(nowDat).substring(0, 7) + '月';
                    timeStr = timeStr.replace('-', '年');
                    aqiAve = parseInt(aqiSum / count, 10);
                    result[timeStr] = aqiAve;
                    aqiSum = 0;
                    count = 0;
                    startDat = nextDay;
                }
            }
        }
        return result;
    }
};
//粒度发生变化时的处理函数
function graTimeChange(event) {
    //设置对应数据
    pageState.nowGraTime = event.target.value;
    setData();
    //调用图表渲染函数
    renderChart();
}

//select发生变化时的处理函数
function citySelectChange(event) {
    //设置对应数据
    pageState.nowSelectCity = event.target.value;
    setData();
    //调用图表渲染函数
    renderChart();
}

// 初始化日、周、月的radio事件，当点击时，调用graTimeChange
function initGraTimeForm() {
   var formGraTime =  document.getElementById('formGraTime');
   formGraTime.addEventListener('change', graTimeChange);
}

// 初始化城市select下拉选择框中的选项
function initCitySelect() {
    // 读取aqiSourceData中的城市，然后设置为city-select的下拉列表中的选项
    var citySelect = document.getElementById('citySelect');
    var citys = Object.keys(aqiSourceData);
    var cityStr = '';
    for (var i = 0; i < citys.length; i++ ) {
        cityStr += '<option>' + citys[i] + '</option>';
    }
    citySelect.innerHTML = cityStr;
    pageState.nowSelectCity = citys[0];
    citySelect.addEventListener('change', citySelectChange);
}

function init() {
    initGraTimeForm();
    initCitySelect();
    setData();
    renderChart();
}
window.onload = function() {
    init();
};