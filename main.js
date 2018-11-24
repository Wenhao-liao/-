/*
* @Author: Administrator
* @Date:   2018-11-20 16:37:02
* @Last Modified by:   Administrator
* @Last Modified time: 2018-11-24 17:48:01
*/
// setup canvas
var para = document.querySelector('p');
var count = 0;

var canvas = document.querySelector('canvas');
//ctx指代canvas上的一块允许我们绘制2D图形的区域
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number
// 返回2个数字之间的随机数
function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}


function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this,x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;

}
function EvilCircle(x,y,exists) {
  Shape.call(this,x,y,20,20,exists);
  this.color = 'white';
  this.size = 10;
}

//操作我们之前定义的ctx对象(canvas 2D对象)，通过调用一些他的方法和设置属性，在他的上面绘制一些图形
Ball.prototype.draw = function() {
//当你想创建一个新的路径时，调用此方法
  ctx.beginPath();
  ctx.fillStyle = this.color;
//Canvas 2D API 绘制圆弧路径的方法
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
//Canvas 2D API 根据当前的填充样式，填充当前或已存在的路径的方法
  ctx.fill();
}


//下面2行代码可以创造出一个小球
// var testBall = new Ball(50, 100, 4, 4, 'blue', 10);
// testBall.draw();

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}
//碰撞检测，在改变x,y后检测
Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
//一旦相遇则更改颜色
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

EvilCircle.prototype.draw =function() {
//当你想创建一个新的路径时，调用此方法
  ctx.beginPath();
  ctx.lineWidth  = 3;
  ctx.strokeStyle = this.color;
//Canvas 2D API 绘制圆弧路径的方法
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
//Canvas 2D API 根据当前的填充样式，填充当前或已存在的路径的方法
  ctx.stroke();
}


EvilCircle.prototype.checkBounds = function() {
	 if ((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if ((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y -= this.size;
  }

}

EvilCircle.prototype.setControls = function() {
	//定义一个变量存储这个this，防止下面this指向的改变
	var _this = this;
window.onkeydown = function(e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }
  }
}

EvilCircle.prototype.collisionDetect = function() {
	  for (var j = 0; j < balls.length; j++) {
	  	 if( balls[j].exists ) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
//一旦相遇则更改颜色
      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = 'Ball count: ' + count;
      }
    }
  }
}
// 存储小球的数组
var balls = [];
var evil = new EvilCircle(random(0,width), random(0,height), true);
evil.setControls();

//动画效果都会用到一个运动循环，也就是每一帧都自动更新视图。这是大多数游戏或者其他类似项目的基础。
function loop() {
  //在该2d画布上绘制填充矩形,覆盖前一次的东西，但是设置了一个较低的透明度，由此达到一个尾巴的特效
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  //填满小球数组
  while (balls.length < 25) {
  	var size = random(10,20);
    var ball = new Ball(
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      true,
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(10,20),
      size
    );
    balls.push(ball);
    count++;
    para.textContent = 'Ball count: ' + count;
  }

  for (var i = 0; i < balls.length; i++) {
  	// console.log(balls[i].exists);
  	if(balls[i].exists){
  	//画小球
    balls[i].draw();
    //进行帧数的更新（x,y坐标改变）
    balls[i].update();
    balls[i].collisionDetect();
    }
  }
  //下一次重绘之前执行回调函数
   evil.draw();
  evil.checkBounds();
  evil.collisionDetect();
  requestAnimationFrame(loop);
  // loop();
}
loop();
