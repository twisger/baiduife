
window.onload = function() {
    var queue = [],
        queueControll = document.getElementById('queueControll'),
        numInput = queueControll.children[0].children[0],
        leftIn = queueControll.children[1],
        rightIn = queueControll.children[2],
        leftOut = queueControll.children[3],
        rightOut = queueControll.children[4];
    //输入验证
    numInput.addEventListener('focusout', function() {
        if (!numInput.value.match(/^\d+$/)) {
            alert('请输入数字');
            numInput.value = '';
        }
    });
    // 给按钮绑定事件
    leftIn.onclick = function() {
        queue.unshift(numInput.value);
        renderQueue();
    };
    leftOut.onclick = function() {
        if (!queue.length) {
            alert('队列为空');
            return;
        }
        alert(queue.shift());
        renderQueue();
    };
    rightIn.onclick = function() {
        if (!queue.length) {
            alert('队列为空');
            return;
        }
        queue.push(numInput.value);
        renderQueue();
    };
    rightOut.onclick = function() {
        alert(queue.pop());
        renderQueue();
    };
    var queueShow = document.getElementById('queueShow');
    // 根据队列渲染HTML
    function renderQueue() {
        var queueHTMLStr = '';
        queue.forEach(function(item, i, array) {
            queueHTMLStr += '<span data-index="' + i +'">'+ item + '</span>';
        });
        queueShow.innerHTML = queueHTMLStr;
    }
    // 使用事件代理给生成的队列绑定删除事件
    queueShow.addEventListener('click', function(event) {
        if (event.target.nodeName.toLowerCase() === 'span') {
            var index = event.target.dataset.index;
            queue.splice(index, 1);
            renderQueue();
        }
    });
};