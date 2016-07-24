var queue = [];
var nodes = []; //用于保存队列节点

//操作前检测环境
function actionCheck(action) {
    var queueControll = document.getElementById('queueControll');
    var numInput = queueControll.children[0].children[0];
    if (action === 'in') {
        if (!numInput.value.match(/^\d\d$/)) {
            alert('请输入一个十位数');
            numInput.value = '';
            return false;
        } else if (queue.length >= 60) {
            alert('队列已满');
            return false;
        } else {
            return true;
        }
    } else if (action === 'out') {
        if (!queue.length) {
            alert('队列为空');
            return false;
        } else {
            return true;
        }
    } else {
        throw new Error('action must be in or out');
    }
}
// 根据队列渲染HTML
function renderQueue() {
    var queueShow = document.getElementById('queueShow');
    var queueHTMLStr = '';
    queue.forEach(function(item, i, array) {
        queueHTMLStr += '<div data-index="' + i + '">' + item + '</div>';
    });
    queueShow.innerHTML = queueHTMLStr;
    var len = queueShow.children.length;
    for (var i = 0; i < len; i++ ) {
        queueShow.children[i].style.height = queue[i] * 5 + 'px'; 
        queueShow.children[i].style.left = '0';
        queueShow.children[i].style.top = '0';
    }
    // 使用事件代理给生成的队列绑定删除事件
    queueShow.addEventListener('click', function(event) {
        if (event.target.parentNode === queueShow) {
            var index = event.target.dataset.index;
            queue.splice(index, 1); //也可以通过对nodelist使用数组的indexof方法来获取节点位置
            renderQueue();
        }
    });
    //将队列节点存入数组，用于交换动画
    nodes = Array.prototype.slice.call(queueShow.children);
}
// 给各个按钮绑定事件
function init() {
    var queueControll = document.getElementById('queueControll');
    var numInput = queueControll.children[0].children[0];
    var leftIn = queueControll.children[1];
    var rightIn = queueControll.children[2];
    var leftOut = queueControll.children[3];
    var rightOut = queueControll.children[4];
    var randomData = queueControll.children[5];
    leftIn.onclick = function() {
        if (actionCheck('in')) {
            queue.unshift(numInput.value);
            renderQueue();
        }
    };
    leftOut.onclick = function() {
        if (actionCheck('out')) {
            alert(queue.shift());
            renderQueue();
        }
    };
    rightIn.onclick = function() {
        if (actionCheck('in')) {
            queue.push(numInput.value);
            renderQueue();
        }
    };
    rightOut.onclick = function() {
        if (actionCheck('out')) {
           alert(queue.pop());
           renderQueue(); 
        }
    };
    randomData.onclick = function() {
        queue = [];
        for (var i = 0; i < 30; i++) {
            queue[i] = Math.floor(Math.random() * 100);
        }
        renderQueue();
    };
    queueControll.children[6].onclick = function() {   
        //动画开始时禁用按钮
        var btns = queueControll.children;
        for (var i = btns.length - 1; i > 0; i--) {
            btns[i].disabled = true;
        }
        quickSort();
        aniSwapNode();
    };
}

window.onload = function() {
    init();
};

//动画部分
function aniSwapNode() {
    var speed = parseInt(queueControll.children[7].children[0].value, 10);
    var delay = parseInt(queueControll.children[8].children[0].value, 10);
    //改变颜色
    while (animationQueue.length > 0 && animationQueue[0][0] === 'range') {
        aniColor(animationQueue[0][1], animationQueue[0][2]);
        animationQueue.shift();
    }
    if (animationQueue.length > 0) {
        var nodePair = animationQueue.shift();
        var a = nodePair[0];
        var b = nodePair[1];
        var distance = nodes[b].offsetLeft  - nodes[a].offsetLeft;
        var aTarget = parseInt(nodes[a].style.left,10) + distance;
        var bTarget = parseInt(nodes[b].style.left,10) - distance;
        setTimeout(aniplay, delay);
    } else {
        //动画结束后重绘队列，恢复按钮
        renderQueue();
        var btns = document.getElementById('queueControll').children;
        for (var i = btns.length - 1; i > 0; i--) {
            btns[i].disabled = false;
        }
    }
    function aniplay() {
        var aLeft = parseInt(nodes[a].style.left,10);
        var bLeft = parseInt(nodes[b].style.left,10);
        //一对节点交换完毕，交换下一对
        function reach() {
            nodes[a].style.left = aTarget + 'px';
            nodes[b].style.left = bTarget + 'px';
            temp = nodes[a];
            nodes[a] = nodes[b];
            nodes[b] = temp;
            aniSwapNode();
        }
        if (distance > 0) {
            if (aLeft >= aTarget) {
                reach();
            } else {
                nodes[a].style.left = aLeft + speed + 'px';
                nodes[b].style.left = bLeft - speed + 'px';
                setTimeout(aniplay);
            }
        } else {
            if (aLeft <= aTarget) {
                reach();
            } else {
                nodes[a].style.left = aLeft - speed + 'px';
                nodes[b].style.left = bLeft + speed + 'px';
                setTimeout(aniplay);
            }
        }

    }
}
function aniColor(a, b) {
    for (var i = nodes.length - 1; i >= 0; i--) {
        nodes[i].style['background-color'] = '#999';
    }
    for (i = a; i <= b; i++) {
        nodes[i].style['background-color'] = '#f00';
    }
    nodes[a].style['z-index'] = '999';
    nodes[a].style['background-color'] = '#c8c';
}
//排序
var animationQueue = [];
function quickSort() {
    function swap(a, b) {
        var temp = queue[a];
        queue[a] = queue[b];
        queue[b] = temp;
    }
    var stack = [];
    stack.push([0, queue.length - 1]);
    while(stack.length !== 0) {
        var pointer = stack.pop();
        var i = pointer[0];
        var j = pointer[1];
        //保存变色范围
        animationQueue.push(['range', i, j]);
        var key = queue[i];
        while (i < j) {
            while(i < j && queue[j] >= key) {
                j--;
            }
            if (i < j) {
                swap(i, j);
                //保存交换顺序
                animationQueue.push([i,j]);
            }
            while(i < j && queue[i] <= key) {
                i++;
            }
            if (i < j) {
                swap(i, j);
                animationQueue.push([i,j]);
            }
        }
        if (i - pointer[0] > 1) {
            stack.push([pointer[0], i -1]);
        }
        if (pointer[1] - i > 1) {
            stack.push([i + 1, pointer[1]]);
        }
    }
}
