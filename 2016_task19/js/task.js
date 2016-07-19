
window.onload = function() {
    var queue = [];
    var queueControll = document.getElementById('queueControll');
    var numInput = queueControll.children[0].children[0];
    var leftIn = queueControll.children[1];
    var rightIn = queueControll.children[2];
    var leftOut = queueControll.children[3];
    var rightOut = queueControll.children[4];
    var randomNum = queueControll.children[5];
    //输入信息验证及队列信息验证
    function isInfoRight() {
        if (!numInput.value.match(/^\d\d$/)) {
            alert('请输入一个十位数');
            numInput.value = '';
            return false;
        } 
        if (queue.length >= 60) {
            alert('队列已满');
            return false;
        }
        return true;
    }
    // 给按钮绑定事件
    leftIn.onclick = function() {
        if (isInfoRight()) {
            queue.unshift(numInput.value);
            renderQueue();
        }
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
        if (isInfoRight()) {
            queue.push(numInput.value);
            renderQueue();
        }
    };
    rightOut.onclick = function() {
        if (!queue.length) {
            alert('队列为空');
            return;
        }
        alert(queue.pop());
        renderQueue();
    };
    var queueShow = document.getElementById('queueShow');
    // 根据队列渲染HTML
    function renderQueue() {
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
    }
    // 使用事件代理给生成的队列绑定删除事件
    queueShow.addEventListener('click', function(event) {
        if (event.target.parentNode === queueShow) {
            var index = event.target.dataset.index;
            queue.splice(index, 1);
            renderQueue();
        }
    });
    // 随机生成30个数据
    randomNum.onclick = function() {
        queue = [];
        for (var i = 0; i < 30; i++) {
            queue[i] = Math.floor(Math.random() * 100);
        }
        renderQueue();
    };
    function swapPosition(nodeA, nodeB) {
        var distance = nodeA.offsetLeft  - nodeB.offsetLeft;
        move(nodeA, 'left', -distance, 1);
        move(nodeB, 'left', distance, 1);
    }
    //距离为正时右移，为负时左移。
    function move(node, property, distance, speed) {
        var target = parseInt(node.style[property], 10) + distance;
        var timer = setInterval(function(){
            if (distance > 0) {
                if (parseInt(node.style[property], 10) >= target) {
                    node.style[property] = target + 'px';
                    clearInterval(timer);
                } else {
                    node.style[property] = parseInt(node.style[property], 10) + speed + 'px';
                }
            } else {
                if (parseInt(node.style[property], 10) <= target) {
                    node.style[property] = target + 'px';
                    clearInterval(timer);
                } else {
                    node.style[property] = parseInt(node.style[property], 10) - speed + 'px';
                }
            }
        });
    }
    queueControll.children[6].onclick = function() {
    };
    function swap(a, b) {
        queue[a] = queue[a] ^ queue[b];
        queue[b] = queue[a] ^ queue[b];
        queue[a] = queue[a] ^ queue[b];
    }
    function quickSort() {
        var stack = [];
        stack.push([0, queue.length - 1]);
        while(stack.length !== 0) {
            var pointer = stack.pop();
            var i = pointer[0];
            var j = pointer[1];
            var key = queue[i];
            while (i < j) {
                while(i < j && queue[j] >= key) {
                    j--;
                }
                swap(i, j);
                while(i < j && queue[i] <= key) {
                    i++;
                }
                swap(i, j);
            }
            if (i - pointer[0] > 1) {
                stack.push([pointer[0], i -1]);
            }
            if (pointer[1] - i > 1) {
                stack.push([i + 1, pointer[1]]);
            }
        }
    }
    queueControll.children[7].onclick = quickSort;

};

