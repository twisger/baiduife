window.onload = function() {
    var queue = [],
        queueControll = document.getElementById('queueControll'),
        queueShow = document.getElementById('queueShow'),
        textInput = queueControll.children[0].children[0],
        leftIn = queueControll.children[1],
        rightIn = queueControll.children[2],
        leftOut = queueControll.children[3],
        rightOut = queueControll.children[4],
        inqueryBtn = queueControll.children[6];

    function enQueue(direction) {
        if (textInput.value === '') {
            return;
        }
        var texts = textInput.value.split(/[,，\s]{1}/);
        if (direction === 'left') {
            queue = texts.concat(queue);
        } else if (direction === 'right') {
            queue = queue.concat(texts);
        } else {
            throw new error('direction must be left or right');
        }
    }

    function query() {

        renderQueue();
        var key = queueControll.children[5].children[0].value;
        if (key === '') {
            return;
        }
        key = key.trim();
        var nodes = queueShow.children;
        for (var i = nodes.length - 1; i >= 0; i--) {
            if (nodes[i].innerHTML.search(key) > -1) {
                var keyRange = document.createRange();
                var text = nodes[i].firstChild;
                var content = nodes[i].innerHTML;
                keyRange.setStart(text, content.indexOf(key));
                keyRange.setEnd(text, content.indexOf(key) + key.length);
                var span = document.createElement('span');
                span.style.color = 'blue';
                keyRange.surroundContents(span);
                nodes[i].className = 'match-content';
            } else {
                nodes[i].className = '';
            }
        } 
    }
    // 根据队列渲染HTML
    function renderQueue() {
        var queueHTMLStr = '';
        queue.forEach(function(item, i, array) {
            queueHTMLStr += '<div data-index="' + i +'">'+ item + '</div>';
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
    // 给按钮绑定事件
    leftIn.onclick = function() {
        enQueue('left');
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
        enQueue('right');
        renderQueue();
    };
    rightOut.onclick = function() {
        if (!queue.length) {
            alert('队列为空');
            return;
        }
        alert(queue.pop());
        renderQueue();
    };
    inqueryBtn.onclick = query;
};