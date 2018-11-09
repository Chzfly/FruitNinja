(function (){
    var Light = window.Light = function (sx, sy, ex, ey){
        //在canvas上绘制一段线段，起始点是sx，sy，结束点是ex，ey，最后将本身放入数组中进行管理
        this.sx = sx;
        this.sy = sy;
        this.ex = ex;
        this.ey = ey;
        this.light_w = 10;

        game.scene.lightArr.push(this);
    }
    Light.prototype.update = function (){
        this.light_w -= 1;
        if(this.light_w <=0){
            this.lightDel();
        }
    }
    Light.prototype.render = function (){
        game.ctx.beginPath();
        game.ctx.moveTo(this.sx, this.sy);
        game.ctx.lineTo(this.ex, this.ey);
        game.ctx.strokeStyle = 'white';
        game.ctx.lineCap = 'round';
        game.ctx.lineWidth = this.light_w;
        game.ctx.stroke();
    }
    Light.prototype.lightDel = function (){
        // game.scene.lightArr.splice(game.scene.lightArr.indexOf(this), 1);
        for(var i = 0 ; i < game.scene.lightArr.length;i++){
              if(game.scene.lightArr[i]==this){
                    game.scene.lightArr.splice(i,1);
              }
        }
    }

    //cut检测，如果满足cut条件则返回这个light实例，否则返回布尔值false。
    Light.prototype.cutCheck = function (ox, oy, r){
        if(((this.sx - ox) * (this.sx - ox) + (this.sy - oy) * (this.sy - oy)) >= r * r && ((this.ex - ox) * (this.ex - ox) + (this.ey - oy) * (this.ey - oy)) < r * r){
            return this;
        }else{
            return false;
        }
    }
})()