var WINDOW_WIDTH = 0;
var WINDOW_HEIGHT = 0;
var RADIUS = 0;
var MARGIN_TOP = 0;
var MARGIN_LEFT = 0;


var curShowTimeSeconds = 0;


var balls = [];
const colors = ["#99CC00", "#669900"];

window.onload = function () {
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight * 0.65;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 8);


    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    /*首先进行随机化初始化fillStyle,以防在renderDigit中第一次渲染时没有初始化颜色而使打开时一开始的颜色为黑色*/
    context.fillStyle = getRandomColor();
    setInterval(
		function () {
		        render(context);
		        update();
		},
		40
	);


}

function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var hour = curTime.getHours();
    var minute = curTime.getMinutes();
    var second = curTime.getSeconds();


    var ret = hour * 3600 + minute * 60 + second;

    return ret;
}

function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = parseInt(nextShowTimeSeconds % 60);

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = parseInt(curShowTimeSeconds % 60);

    if (nextSeconds != curSeconds) {
        if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
            addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curHours / 10));
        }
        if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
        }

        if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
        }

        if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
        }

        if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));

        }
        if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
            

        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();

}
function updateBalls() {
    var multiNum = getBounceNum();  
    
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;       
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * multiNum;
        }

    }

    var cnt = 0;
    for (var i = 0; i < balls.length; i++) {
        /*删去不在画面中的小球*/
        if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH) {
            balls[cnt++] = balls[i];
        }
    }

    while (balls.length > Math.min(1000, cnt)) {
        balls.pop();
    }
    showBallsNums(balls)

}
function getBounceNum() {
    var newValue = document.getElementById("range1").value;
    
     document.getElementById("rangeNumShowText").innerHTML ="反弹系数:"+ newValue;
    
    return newValue;
}

/*利用innerHTML向html中添加内容*/
function showBallsNums(balls) {
    var num = balls.length;
    document.getElementById("ballsNum").innerHTML = "现在小球个数:" + num;

}

function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            var aBall = {
                x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                g: 1.5 + Math.random(),
                vx: Math.pow(-1, Math.ceil(Math.random() * 100)) * 4,
                vy: -4 - Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)]
            }
            balls.push(aBall);
        }
    }
}
function render(cxt) {
    /*对矩形区域进行刷新*/
    cxt.clearRect(0, 0, canvas.width, canvas.height);

    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
    var seconds = parseInt(curShowTimeSeconds % 60);

    /*随机选取colors数组中的颜色作为数字的着色*/
    cxt.fillStyle = colors[Math.random()];
    getDigitShowColor(cxt.fillStyle.toString());
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt);
    /*digit 10对应的是冒号！*/
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);


    /*由于：是4个宽度，然后又要留出1个宽度，所以4*2+1=9 */
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);


    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);

    /*绘制界面中的小球*/
    for (var i = 0; i < balls.length; i++) {
        cxt.fillStyle = balls[i].color;
        
        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI);
        cxt.closePath();  

        cxt.fill();
    }
    
   
}
/*获取时钟颜色*/
function getDigitShowColor(digitColor) {
    document.getElementById("ballsColor").innerHTML = "时钟颜色是:" + digitColor + " "
    + colorChangeToRGB(digitColor);
}
function colorChangeToRGB(tmpColor) {
    var color1 = tmpColor.substring(1, 3); //R
    var color2 = tmpColor.substring(3, 5); //G
    var color3 = tmpColor.substring(5, 7); //B
    var c = [color1, color2, color3];
    var nc = [];
   
    for (var i = 0; i < c.length;i++) {
        var tmp1 = c[i].substring(0,1);
        var tmp2 = c[i].substring(1,2);
        nc[i] = isUnderTen(tmp1)*16 + isUnderTen(tmp2);
    }
    return "RGB(" + nc[0] + "," + nc[1] + "," + nc[2] + ")";
}
function isUnderTen(tnum) {
    var num = 0;
        switch (tnum)
        {
            case "a": num = 10; break;
            case "b": num = 11; break;
            case "c": num = 12; break;
            case "d": num = 13; break;
            case "e": num = 14; break;
            case "f": num = 15; break;
            default: return parseInt(tnum);
        }
        return num;
  
}

function renderDigit(x, y, num, cxt) {
    var newColor = "";
    newColor = getRandomColor();

    colors.push(newColor);
    if (colors.length > 20) {
        var cnt = 0;
        for (var i = 0; i < colors.length - 1; i++) {
            colors[cnt++] = colors[i + 1];
        }

    }
    var curnum = colors.length;

    while (curnum-- > 20) {
        colors.pop();
    }

    
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                cxt.beginPath();
                
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                
                cxt.closePath();
                cxt.fill();
            }

        }
    }
    

}

/*获得随机数字颜色*/
function getRandomColor() {
    var str = "#";
    var curNum = 0;
    var colorNum = ["A", "B", "C", "D", "E", "F"];
    for (var i = 0; i < 6; i++) {
        curNum = Math.round(Math.random() * 15);
        curNum >= 15 ? 15 : curNum;
        curNum <= 0 ? 0 : curNum;
        if (curNum >= 10) {
            curNum = colorNum[curNum - 10];
        }
        str += curNum;
    }
    return str;


}
