//防止画画的时候页面会滚动
// docuement.body.ontouchstart = function(){
//     eee.preventDefault()//阻止默认事件
// }
//加上这个之后，所有的功能就不能用了,相对屏幕固定
var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')//获取二次元的上下文
var lineWidth = 5//线的宽度

autoSetCanvasSize(canvas)//还会自动监听window的变化

listenToUser(canvas)


var eraserEnabled = false//是否在使用eraser
//点击画笔和橡皮擦的时候颜色响应的变化
pen.onclick = function(){
    //之前在eraserEnabled前面加了一个var 
    //导致变量提升，里面的变量变成undefined，覆盖外面的变量
    eraserEnabled = false
    pen.classList.add('active')
    eraser.classList.remove('active')
}
eraser.onclick = function(){
    eraserEnabled = true
    eraser.classList.add('active')
    pen.classList.remove('active')
}
red.onclick = function(){
    context.fillStyle = 'red'
    context.strokeStyle = 'red'
    red.classList.add('active')
    green.classList.remove('active')
    blue.classList.remove('active')
}
green.onclick = function(){
    context.fillStyle = 'green'
    context.strokeStyle = 'green'
    red.classList.remove('active')
    green.classList.add('active')
    blue.classList.remove('active')
}
blue.onclick = function(){
    context.fillStyle = 'blue'
    context.strokeStyle = 'blue'
    red.classList.remove('active')
    green.classList.remove('active')
    blue.classList.add('active')
}
thin.onclick = function(){
    lineWidth = 5
}
thick.onclick = function(){
    lineWidth = 10
}
clear.onclick = function(){
    context.clearRect(0,0,canvas.width,canvas.height)
}
download.onclick = function(){
    var url = canvas.toDataURL("image/png")
    console.log(url)
    var a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.download = '_blank'
    a.download = '我的画'
    a.click()
}


/**第一部分：以上是和宽度高度有关的**/
function listenToUser(canvas){
    //var context = canvas.getContext('2d')//获取二次元的上下文

    var using = false//是否在用
    var lastPoint = {x:undefined,y:undefined}//记录一下最新的点
    //监听用户的移动事件


    if(document.body.ontouchstart !== undefined){//特性检测
        //触屏设备
        canvas.ontouchstart = function(aaa){
            console.log('开始触摸')
            console.log(aaa)
            var x = aaa.touches[0].clientX
            var y = aaa.touches[0].clientY
            console.log(x,y)
            using = true
            if(eraserEnabled){
                context.clearRect(x-5,y-5,10,10)
            }else{
                lastPoint={
                    "x":x,
                    "y":y
                }
            }
        }

        canvas.ontouchmove = function(aaa){
            console.log('边触摸边动')
            var x = aaa.touches[0].clientX
            var y = aaa.touches[0].clientY

            if(!using){return}//是否在使用

            if(eraserEnabled){//是否开启
                context.clearRect(x-5,y-5,10,10)   
            }else{
                // var x = aaa.clientX
                // var y = aaa.clientY
                var newPoint = {x:x,y:y}//得到新的一个点，把新的点和旧的连接起来就可以了
                // drawCircle(x,y,1) 
                drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
                lastPoint = newPoint//时时更新上一个点的位置

                //鼠标在动的时候把当前的那个点和之前的那个点连成一条直线
            }
        }

        canvas.ontouchend = function(){
            console.log('触摸完了')
            using = false
        }
    }else{
        //非触屏设备
        canvas.onmousedown = function(aaa){
            // console.log('down')
            var x = aaa.clientX
            var y = aaa.clientY
            using = true;
            if(eraserEnabled){//橡皮擦是否被开启
                context.clearRect(x-5,y-5,10,10)//解决在擦的时候在箭头的下方的问题，所以给x y减5
            }else{
                lastPoint = {x:x,y:y}//第一个点的坐标
                //console.log(lastPoint)
            }
        }        
        
        canvas.onmousemove = function(aaa){
            // console.log('move')
            var x = aaa.clientX
            var y = aaa.clientY

            if(!using){return}//是否在使用

            if(eraserEnabled){//是否开启
                context.clearRect(x-5,y-5,10,10)   
            }else{
                // var x = aaa.clientX
                // var y = aaa.clientY
                var newPoint = {x:x,y:y}//得到新的一个点，把新的点和旧的连接起来就可以了
                // drawCircle(x,y,1) 
                drawLine(lastPoint.x,lastPoint.y,newPoint.x,newPoint.y)
                lastPoint = newPoint//时时更新上一个点的位置

                //鼠标在动的时候把当前的那个点和之前的那个点连成一条直线
            }
        }    

        canvas.onmouseup = function(){
            // console.log('up')
            using = false
        }
    }   

    
}    


/*********第二部分：监听鼠标事件***********/







/*************************/
function autoSetCanvasSize(canvas){
    setCanvasSize()

    //用户重新移动窗口的宽高
    window.onresize = function(){
        setCanvasSize()

        //存在一个bug移动之后,画的内容就不见了
    }

    //代码优化，写个函数，封装获取页面宽高重复的代码
    //保证canvas和页面一样的宽高
    function setCanvasSize(){
        //获取页面的宽高,IE不支持
        var pageWidth = document.documentElement.clientWidth
        var pageHeight = document.documentElement.clientHeight

        //设置的是属性值，不是样式
        canvas.width = pageWidth
        canvas.height = pageHeight 
    }
}

function drawCircle(x,y,radius){
    context.beginPath()
    // context.fillStyle = 'black'
    //圆心，半径，开始弧度数，结束弧度数
    context.arc(x,y,radius,0,Math.PI*2)//用pi表示180
    //context.stroke()
    context.fill()
}

function drawLine(x1,y1,x2,y2){
    context.beginPath();
    // context.strokeStyle = 'black'
    context.moveTo(x1,y1);//起点
    context.lineWidth = lineWidth//取当前线的宽度
    context.lineTo(x2,y2);//终点
    context.stroke()//填充
    context.closePath();//也可以不结束 可以自动结束 
}


