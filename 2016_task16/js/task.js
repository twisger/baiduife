window.onload = function() {
    var hasTHead = false;
    var isAqiCityReady = false;
    var isAqiValueReady = false;
    var aqiData = {};
    var aqiTable = document.getElementById('aqiTable');
    // 表单验证开始
    var aqiCityInput = document.getElementById('aqiCityInput');
    aqiCityInput.addEventListener('focusout', function() {
        // var regNotCity = /[^\sA-za-z\u4e00-\u9fa5]+/g;
        if (!this.value.match(/^[\sA-Za-z\u4e00-\u9fa5]+$/)) {
            document.getElementById('aqiCityTip').innerHTML = '请输入正确的城市名称！';
            isAqiCityReady = false;
        } else {
            aqiCityTip.innerHTML = '';
            isAqiCityReady = true;
        }
    });
    var aqiValueInput = document.getElementById('aqiValueInput');
    aqiValueInput.addEventListener('focusout', function() {
        if (!this.value.match(/^\d+$/)) {
            document.getElementById('aqiValueTip').innerHTML = '请输入正确的空气质量指数!';
            isAqiValueReady = false;
        } else {
            aqiValueTip.innerHTML = '';
            isAqiValueReady = true;
        }
    });
    // 表单验证结束

    // 从用户输入中获取数据，向aqiData中增加一条数据
    function addAqiData() {
        var city = aqiCityInput.value.trim();
        var num = Number(aqiValueInput.value);
        aqiData[city] = num;
    }

    // 添加表头和主体，改变表头标记
    function addTHead() {
        var tHead = aqiTable.createTHead();
        aqiTable.appendChild(tHead);
        tHead.innerHTML = '<th>城市</th><th>空气质量</th><th>操作</th>';
        var tBody = document.createElement('tbody');
        aqiTable.appendChild(tBody);
        hasTHead = true;
    }

    // 渲染aqiTable表格
    function renderAqiList() {
        if (!hasTHead) {
            addTHead();
        }  
        var tBodyStr = '';
        for (var city in aqiData) {
            if (aqiData.hasOwnProperty(city)) {
                tBodyStr += '<tr><td>' + city + '</td><td>' + aqiData[city] + '</td><td><button>删除</button></td></tr>';
            }
        }
        var tBody = aqiTable.getElementsByTagName('tbody')[0];
        tBody.innerHTML = tBodyStr;
    }

    // 点击addBtn时的处理逻辑
    function addBtnHandle() {
        if (isAqiCityReady && isAqiValueReady) {
            addAqiData();
            renderAqiList();
        } else {
            alert('请输入正确的数据！');
        }
    }

    // 点击各个删除按钮的时候的处理逻辑
    function delBtnHandle() {
        var city = this.parentNode.parentNode.firstChild.innerHTML;
        delete aqiData[city];
        renderAqiList();
        //判断tbody内容，为空时清除表格，改变表头标记
        if (aqiTable.children[1].innerHTML === '') {
            aqiTable.innerHTML = '';
            hasTHead = false;
        }
    }
    function init() {
        // 绑定点击事件
        document.getElementById('addBtn').addEventListener('click', addBtnHandle);
        //给所有删除按钮绑定事件
        aqiTable.addEventListener('click', function(event) {
            if (event.target.tagName.toLowerCase() === 'button') {
                delBtnHandle.call(event.target);
            }
        });
    }
    init();
};