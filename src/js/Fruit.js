(function (){
    var Fruit = window.Fruit = function (){
        //通信的开关，防止多次切割数据的传入
        this.io = true;
        //水果中心坐标
        this.x = _.random(63, 577);
        this.start_x = this.x;
        this.y = 400;
        this.idy = -18;
        //分裂时坐标增量
        this.change_x = 0;
        //分裂时的图片中心坐标
        this.x_1 = 0;
        this.y_1 = 0;
        this.x_2 = 0;
        this.y_2 = 0;
        //分裂时闪电的持续时间控制
        this.frame = 0;
        //水果rotate角度
        this.rad = 0;
        //水果被切角度
        this.split_rad = null;
        //炸弹生成编号
        this.boom_count = 0;
        this.boom_flag = false;
        

        //根据水果的状态进行不同的更新和渲染，1：完整 2：切开
        this.fruit_state = 1;

        //随机一个水果种类
        do{
            this.fruitNumber = parseInt(Math.random() * 6);
            switch(this.fruitNumber){
                //apple
                case 0:
                    this.fru = "apple";
                    this.fru_w = 66;
                    this.fru_h = 66;
                    this.r = 31;
                    this.init_rad = Math.PI / 4 * 3;
                    this.boom_flag = false;
                    break;
                //banana
                case 1:
                    this.fru = "banana";
                    this.fru_w = 126;
                    this.fru_h = 50;
                    this.r = 35;
                    this.init_rad = Math.PI / 2;
                    this.boom_flag = false;
                    break;
                //peach
                case 2:
                    this.fru = "peach";
                    this.fru_w = 62;
                    this.fru_h = 59;
                    this.r = 28;
                    this.init_rad = Math.PI / 4 * 3;
                    this.boom_flag = false;
                    break;
                //sandia
                case 3:
                    this.fru = "sandia";
                    this.fru_w = 98;
                    this.fru_h = 85;
                    this.r = 40;
                    this.init_rad = Math.PI / 2;
                    this.boom_flag = false;
                    break;
                //strawberry
                case 4:
                    this.fru = "strawberry";
                    this.fru_w = 68;
                    this.fru_h = 72;
                    this.r = 30;
                    this.init_rad = Math.PI / 4;
                    this.boom_flag = false;
                    break;
                //boom
                case 5:
                    this.boom_count ++;
                    this.fru = "boom";
                    this.fru_w = 66;
                    this.fru_h = 68;
                    this.r = 34;
                    // this.init_rad = Math.PI / 4;
                    if(this.boom_count < 1){
                        this.boom_flag = true;
                    }else{
                        this.boom_flag = false;
                    }
            }
        }while(this.boom_flag)



        //将自己推入数组
        game.scene.fruitArr.push(this);
    }
    Fruit.prototype.update = function (){
        console.log('当前水果状态码：' + this.fruit_state);
        switch(this.fruit_state){
            case 1:
                //旋转
                //x坐标变化，左边往右走，右边往左走
                if(this.start_x < 320){
                    this.x += 3;
                    this.rad += 0.1;
                }else{
                    this.x -= 3;
                    this.rad -= 0.1;
                }
                //y坐标变化，上抛运动
                this.idy += 0.5;
                this.y += this.idy;
                //检测，如果掉出屏幕则将本身从数组中删除，管理内存
                if(this.y > 600){
                    this.fruitDel();
                }
                //检测miss
                if(this.fruitNumber != 5){
                    if(this.io && this.y > 500){
                        this.io = false;
                        game.scene.miss ++;
                    }
                }
                
                break;
            case 2:
                this.idy += 0.5;
                this.y += this.idy;
                if(this.y > 600){
                    this.fruitDel();
                }

                if(this.split_rad < 0){
                    this.x_1 = this.x - this.change_x;
                    this.x_2 = this.x + this.change_x;
                }else{
                    this.x_1 = this.x + this.change_x;
                    this.x_2 = this.x - this.change_x;
                }
                
                this.change_x += 5;
                this.frame ++;
                break;


        }
        
    }
    Fruit.prototype.render = function (){
        switch(this.fruit_state){
            case 1:
                game.ctx.save();
                game.ctx.translate(this.x, this.y);
                game.ctx.rotate(this.rad);
                game.ctx.drawImage(game.R[this.fru],  - this.fru_w / 2,  - this.fru_h / 2, this.fru_w, this.fru_h);
                game.ctx.restore()
                break;
            case 2:
            //渲染左半边
                game.ctx.save();
                game.ctx.translate(this.x_1, this.y);
                game.ctx.rotate(this.init_rad + this.split_rad);
                game.ctx.drawImage(game.R[this.fru + '-1'], - this.fru_w / 2,  - this.fru_h / 2, this.fru_w, this.fru_h);
                game.ctx.restore();
            //渲染右半边
                game.ctx.save();
                game.ctx.translate(this.x_2, this.y);
                game.ctx.rotate(this.init_rad + this.split_rad);
                game.ctx.drawImage(game.R[this.fru + '-2'], - this.fru_w / 2,  - this.fru_h / 2, this.fru_w, this.fru_h);
                game.ctx.restore();
            //渲染闪电
                if(this.frame < 10){
                    game.ctx.save();
                    game.ctx.translate(this.x, this.y);
                    game.ctx.rotate(this.split_rad);
                    game.ctx.drawImage(game.R['flash'], -179, -10, 358, 20);
                    game.ctx.restore();
                }
                break;
        }
        
    }

    Fruit.prototype.fruitDel = function (){
        game.scene.fruitArr.splice(game.scene.fruitArr.indexOf(this), 1);
        console.log(game.scene.fruitArr);
    }
})()