var canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d')

// squares
// c.fillStyle = "black"
// c.fillRect(100, 100, 100, 100);
// c.fillRect(100, 300, 100, 100);
// c.fillStyle = "grey"
// c.fillRect(200, 400, 100, 100);
// c.fillRect(200, 200, 100, 100);

// lines
// c.beginPath();
// c.moveTo(50,300);
// c.lineTo(300,100);
// c.lineTo(500, 300)
// c.strokeStyle = "blue"
// c.stroke();

// circles
// c.beginPath()
// c.arc(300, 300, 30, 0, Math.PI*2, false);
// c.strokeStyle = "red"
// c.stroke()


// for(var i = 0; i<10; i++){
//     var radius = 30
//     var x =Math.random() * innerWidth;
//     var y = Math.random() * innerHeight
//     c.beginPath()
//     c.arc(x, y, radius, 0, Math.PI*2, false);
//     c.strokeStyle = "red"
//     c.stroke()
//     }

function Circle(x, y, dx, dy, radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius

    this.draw = function(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.strokeStyle = "red"
        c.stroke()
        c.fill()
    }

    this.update = function(){
         if(this.x + this.radius > innerWidth || this.x-this.radius<0){
            this.dx = -this.dx
        }
        if(this.y + this.radius > innerHeight || this.y-this.radius<0){
            this.dy = -this.dy
        }
        this.x += this.dx
        this.y += this.dy

        this.draw()
    }
}



var circleArray = [];
for (var i = 0; i<100; i++){
    var radius =30
    var x = Math.random() * (innerWidth- radius * 2) + radius
    var y = Math.random() * (innerHeight- radius*2) +radius
    var dx = (Math.random() - 0.5) 
    var dy = (Math.random() - 0.5)
    

    circleArray.push(new Circle(x,y,dx,dy,radius))
}



    function animate(){
        requestAnimationFrame(animate);
        c.clearRect(0,0,innerWidth,innerHeight)
       for(var i = 0; i<circleArray.length; i++){
        circleArray[i].update();

       }
    }

    animate()