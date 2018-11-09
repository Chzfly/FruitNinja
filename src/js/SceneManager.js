(function (){
    var SceneManager = window.SceneManager = function (){
        //场景编号1：开始选择界面 2：切换界面 3：切换界面 4：游戏界面 5：结束界面 6：等待开发
        this.sceneNumber = 1;

        //几张图片的位置
        this.home_mask_x = 0;
        this.home_mask_y = -200;
        this.home_mask_idy = 10;
        this.ninja_x = 320;
        this.ninja_y = -130;
        this.ninja_idy = 10;
        this.ninja_dir = true;
        this.ninja_flag = 0;
        this.home_desc_x = -200;//18
        this.home_desc_y = 130;
        this.home_desc_idx = 5;
        //中心坐标,peach和dojo共用
        this.peach_x = 140;
        this.peach_y = 340;
        this.peach_scale = 0;
        this.peach_rad = 0;
        this.peach_flag = true;
        this.dojo_rad = 0;
        //中心坐标，sandia和new_game共用
        this.sandia_x = 380;
        this.sandia_y = 340;
        //light实例数组
        this.lightArr = [];
        //分裂时的动画的角度
        this.split_rad = 0;
        //分裂时flash持续时间
        this.flash_frame = 0;
        //分裂时peach运动
        this.peach_x2 = 140;
        this.peach_y2 = 340;
        //分裂时sndia运动
        this.sandia_x2 = 380;
        this.sandia_y2 = 340;
        //fruit生成间隔
        this.fruit_frame = 0;
        //分数
        this.score = 0;
        //miss数量
        this.miss = 0;
        //结束界面
        this.gameover_scale = 0;

        //waiting等待时间
        this.waiting_frame = 0;
        this.waiting_scale = 0;
        //结束延迟
        this.gameover_delay = 0;
        //炸弹位置
        this.boom_x = null;
        this.boom_y = null;
        //爆炸闪烁
        this.boom_alpha = 0.2;
        this.boom_alpha_change = 0.1;
        this.boom_delay = 0;

        //管理水果实例
        this.fruitArr = [];
        //绑定事件
        this.bindEvent();

       
    }
    SceneManager.prototype.update = function (){
        
        //根据场景编号进行更新
        switch(this.sceneNumber){
            case 1:
                //开始界面图滑动进场，更新图片坐标
                this.home_mask_idy = this.home_mask_idy <= 2 ? 2 : this.home_mask_idy - 0.3;
                this.home_mask_y = this.home_mask_y >= 0 ? 0 : this.home_mask_y + this.home_mask_idy;
                //ninja图片动画
                if(this.ninja_dir && this.home_mask_y == 0){
                        this.ninja_idy += 0.2;
                        this.ninja_y += this.ninja_idy;
                    if(this.ninja_y >= 45){
                        if(this.ninja_flag < 2){
                            this.ninja_dir = !this.ninja_dir;
                            this.ninja_flag ++;
                        }else{
                            this.ninja_y = 45;
                        }
                    }
                }else if(!this.ninja_dir && this.home_mask_y == 0){
                    this.ninja_idy -= 0.8;
                    this.ninja_y -= this.ninja_idy;
                    if(this.ninja_idy <= 0){
                        this.ninja_dir = !this.ninja_dir;
                    }
                }
                //home-desc图片动画
                if(this.ninja_flag >= 2){
                    this.home_desc_x = this.home_desc_x >= 18 ? 18 : this.home_desc_x + this.home_desc_idx;
                }
                //peach动画、dojo动画
                if(this.home_desc_x == 18){
                    this.peach_scale = this.peach_scale >= 1 ? 1 : this.peach_scale + 0.05;
                }
                if(this.peach_scale == 1){
                    this.peach_rad += 0.006;
                    this.dojo_rad -= 0.004;
                }

                //进行场景1的cut检测
                if(this.peach_scale == 1){
                    for(var i = 0; i < this.lightArr.length; i ++){
                        //判断是否切到桃子
                        if(this.lightArr[i].cutCheck(this.peach_x, this.peach_y, 28)){
                            game.splatter.play();
                            game.menu.pause();
                            var split_x = this.lightArr[i].cutCheck(this.peach_x, this.peach_y, 28).ex - this.lightArr[i].cutCheck(this.peach_x, this.peach_y, 28).sx;
                            var split_y = this.lightArr[i].cutCheck(this.peach_x, this.peach_y, 28).ey - this.lightArr[i].cutCheck(this.peach_x, this.peach_y, 28).sy;
                            this.split_rad = Math.atan2(split_y, split_x);
                            console.log('切断角度' + this.split_rad / Math.PI * 180);
                            this.enter(2);//切桃子进场景2
                            
                        }
                        //判断是否切到西瓜
                        if(this.lightArr[i].cutCheck(this.sandia_x, this.sandia_y, 40)){
                            game.splatter.play();
                            game.menu.pause();
                            var split_x = this.lightArr[i].cutCheck(this.sandia_x, this.sandia_y, 40).ex - this.lightArr[i].cutCheck(this.sandia_x, this.sandia_y, 40).sx;
                            var split_y = this.lightArr[i].cutCheck(this.sandia_x, this.sandia_y, 40).ey - this.lightArr[i].cutCheck(this.sandia_x, this.sandia_y, 40).sy;
                            this.split_rad = Math.atan2(split_y, split_x);
                            console.log('切断角度' + this.split_rad / Math.PI * 180);
                            this.enter(3);//切西瓜进场景3
                            
                        }
                    }
                }
                break;
            case 2:
                //被切peach的动画
                this.flash_frame ++;
                if(this.split_rad < 0){
                    this.peach_x -= 2;
                    this.peach_x2 += 2;
                }else{
                    this.peach_x += 2;
                    this.peach_x2 -= 2;
                }
                this.peach_y += 5;
                this.peach_y2 += 5;
                //其他图片的动画
                this.home_mask_y -= 5;
                this.ninja_y -= 5;
                this.home_desc_y -= 5;
                this.sandia_y += 5;

                //自动进入场景6
                if(this.sandia_y >= 600){
                    this.enter(6);
                }

                break;
            case 3:
                //被切西瓜的动画
                this.flash_frame ++;
                if(this.split_rad < 0){
                    this.sandia_x -= 2;
                    this.sandia_x2 += 2;
                }else{
                    this.sandia_x += 2;
                    this.sandia_x2 -= 2;
                }
                this.sandia_y += 5;
                this.sandia_y2 += 5;
                //其他图片的动画
                this.home_mask_y -= 5;
                this.ninja_y -= 5;
                this.home_desc_y -= 5;
                this.peach_y += 5;

                //自动进入场景4
                if(this.sandia_y >= 600){
                    this.enter(4);
                }
                break;
            case 4:
                this.fruit_frame ++;
                if(this.fruit_frame % 50 == 0){
                    new Fruit();
                    game.throw.play();
                }
                //检测是否切割
                for(var j = 0; j < this.lightArr.length; j ++){
                    for(var k = 0; k < this.fruitArr.length; k ++){
                        //遍历每个light和每个fruit进行比较检测,如果被切到将该水果的状态码改为2
                        if(this.lightArr[j].cutCheck(this.fruitArr[k].x, this.fruitArr[k].y, this.fruitArr[k].r)){
                            //计算切割角度
                            var split_x = this.lightArr[j].cutCheck(this.fruitArr[k].x, this.fruitArr[k].y, this.fruitArr[k].r).ex - this.lightArr[j].cutCheck(this.fruitArr[k].x, this.fruitArr[k].y, this.fruitArr[k].r).sx;
                            var split_y = this.lightArr[j].cutCheck(this.fruitArr[k].x, this.fruitArr[k].y, this.fruitArr[k].r).ey - this.lightArr[j].cutCheck(this.fruitArr[k].x, this.fruitArr[k].y, this.fruitArr[k].r).sy;
                            var split_rad = Math.atan2(split_y, split_x);


                            //改变状态码，并且将切割角度传入水果实例当中
                            if(this.fruitArr[k].fruitNumber == 5){
                                //切到炸弹，并且将炸弹坐标传入场景7

                                game.boom.play();
                                this.enter(7, this.fruitArr[k].x, this.fruitArr[k].y);
                            }else{
                                game.splatter.pause();
                                game.splatter.play();
                                if(this.fruitArr[k].io){
                                    this.fruitArr[k].fruit_state = 2;
                                    this.fruitArr[k].split_rad = split_rad;
                                    this.fruitArr[k].io = false;
                                    console.log(this.fruitArr[k].split_rad);
                                    this.score ++;
                                }
                            }
                            
                            
                        }
                    }
                }
                //显示xx
                switch(this.miss){
                    case 0:
                        game.ctx.drawImage(game.R["x"], 550, 10, 22, 19);
                        game.ctx.drawImage(game.R["xx"], 577, 10, 27, 26);
                        game.ctx.drawImage(game.R["xxx"], 609, 10, 32, 32);
                        break;
                    case 1:
                        game.ctx.drawImage(game.R["xf"], 550, 10, 22, 19);
                        game.ctx.drawImage(game.R["xx"], 577, 10, 27, 26);
                        game.ctx.drawImage(game.R["xxx"], 609, 10, 32, 32);
                        break;
                    case 2:
                        game.ctx.drawImage(game.R["xf"], 550, 10, 22, 19);
                        game.ctx.drawImage(game.R["xxf"], 577, 10, 27, 26);
                        game.ctx.drawImage(game.R["xxx"], 609, 10, 32, 32);
                        break;
                    case 3:
                        game.ctx.drawImage(game.R["xf"], 550, 10, 22, 19);
                        game.ctx.drawImage(game.R["xxf"], 577, 10, 27, 26);
                        game.ctx.drawImage(game.R["xxxf"], 609, 10, 32, 32);
                        break;
                    case 4:
                        this.enter(5);//进入结束界面
                }
                for(var i = 0; i < this.fruitArr.length; i ++){
                    this.fruitArr[i].update();
                }
                
                break;
            case 5:
                this.gameover_scale = this.gameover_scale >= 1 ? 1 : this.gameover_scale + 0.05;
                this.gameover_delay ++;

                break;
            case 6:
                this.waiting_frame ++;
                this.waiting_scale = this.waiting_scale >= 1 ? 1 : this.waiting_scale + 0.05;
                if(this.waiting_frame % 100 == 0){
                    this.enter(1);
                }

                break;
            case 7:
                if(this.boom_alpha < 0.2 || this.boom_alpha > 0.8){
                    this.boom_alpha_change = -this.boom_alpha_change;
                    this.boom_delay++;
                }
                this.boom_alpha += this.boom_alpha_change;
                if(this.boom_delay > 5){
                    this.enter(5);
                }
                break;
        }
    }
    


    SceneManager.prototype.render = function (){
        
        //根据场景编号进行渲染
        switch(this.sceneNumber){
            case 1:
                //场景1都是固定位置图片，直接渲染
                game.ctx.drawImage(game.R['home-mask'], this.home_mask_x, this.home_mask_y, 640, 183);
                game.ctx.drawImage(game.R['logo'], 20 + this.home_mask_x, this.home_mask_y, 288, 135);
                game.ctx.drawImage(game.R['ninja'], this.ninja_x, this.ninja_y, 244, 81);
                game.ctx.drawImage(game.R['home-desc'], this.home_desc_x, this.home_desc_y, 161, 91);
                
                //peach
                game.ctx.save();
                game.ctx.translate(this.peach_x, this.peach_y);
                game.ctx.rotate(this.peach_rad);
                game.ctx.scale(this.peach_scale, this.peach_scale);
                game.ctx.drawImage(game.R['peach'], ( - 31 * this.peach_scale) / this.peach_scale, ( - 29.5 * this.peach_scale) / this.peach_scale, 62, 59);
                game.ctx.restore();
                //dojo
                game.ctx.save();
                game.ctx.translate(this.peach_x, this.peach_y);
                game.ctx.rotate(this.dojo_rad);
                game.ctx.scale(this.peach_scale, this.peach_scale);
                game.ctx.drawImage(game.R['dojo'], ( - 87.5 * this.peach_scale) / this.peach_scale, ( - 87.5 * this.peach_scale) / this.peach_scale, 175, 175);
                game.ctx.restore();
                
                //sandia
                game.ctx.save();
                game.ctx.translate(this.sandia_x, this.sandia_y);
                game.ctx.rotate(this.peach_rad);
                game.ctx.scale(this.peach_scale, this.peach_scale);
                game.ctx.drawImage(game.R['sandia'], ( - 49 * this.peach_scale) / this.peach_scale, ( - 42.5 * this.peach_scale) / this.peach_scale, 98, 85);
                game.ctx.restore();
                //new_game
                game.ctx.save();
                game.ctx.translate(this.sandia_x, this.sandia_y);
                game.ctx.rotate(this.dojo_rad);
                game.ctx.scale(this.peach_scale, this.peach_scale);
                game.ctx.drawImage(game.R['new-game'], ( - 97.5 * this.peach_scale) / this.peach_scale, ( - 97.5 * this.peach_scale) / this.peach_scale, 195, 195);
                game.ctx.restore();
                break;
            case 2:
                game.ctx.drawImage(game.R['home-mask'], this.home_mask_x, this.home_mask_y, 640, 183);
                game.ctx.drawImage(game.R['logo'], 20 + this.home_mask_x, this.home_mask_y, 288, 135);
                game.ctx.drawImage(game.R['ninja'], this.ninja_x, this.ninja_y, 244, 81);
                game.ctx.drawImage(game.R['home-desc'], this.home_desc_x, this.home_desc_y, 161, 91);
                
                //peach-1
                game.ctx.save();
                game.ctx.translate(this.peach_x, this.peach_y);
                game.ctx.rotate( Math.PI / 4 * 3 + this.split_rad);
                game.ctx.scale(this.peach_scale, this.peach_scale);
                game.ctx.drawImage(game.R['peach-1'], ( - 31 * this.peach_scale) / this.peach_scale, ( - 29.5 * this.peach_scale) / this.peach_scale, 62, 59);
                game.ctx.restore();
                //peach-2
                game.ctx.save();
                game.ctx.translate(this.peach_x2, this.peach_y2);
                game.ctx.rotate( Math.PI / 4 * 3 + this.split_rad);
                game.ctx.scale(this.peach_scale, this.peach_scale);
                game.ctx.drawImage(game.R['peach-2'], ( - 31 * this.peach_scale) / this.peach_scale, ( - 29.5 * this.peach_scale) / this.peach_scale, 62, 59);
                game.ctx.restore();
                
                //sandia
                game.ctx.save();
                game.ctx.translate(this.sandia_x, this.sandia_y);
                game.ctx.rotate(this.peach_rad);
                game.ctx.scale(this.peach_scale, this.peach_scale);
                game.ctx.drawImage(game.R['sandia'], ( - 49 * this.peach_scale) / this.peach_scale, ( - 42.5 * this.peach_scale) / this.peach_scale, 98, 85);
                game.ctx.restore();
                //new_game
                game.ctx.save();
                game.ctx.translate(this.sandia_x, this.sandia_y);
                game.ctx.rotate(this.dojo_rad);
                game.ctx.scale(this.peach_scale, this.peach_scale);
                game.ctx.drawImage(game.R['new-game'], ( - 97.5 * this.peach_scale) / this.peach_scale, ( - 97.5 * this.peach_scale) / this.peach_scale, 195, 195);
                game.ctx.restore();

                //切断效果渲染flash
                if(this.flash_frame < 10){
                    game.ctx.save();
                    game.ctx.translate(this.peach_x, this.peach_y);
                    game.ctx.rotate(this.split_rad);
                    game.ctx.drawImage(game.R['flash'], -179, -10, 358, 20);
                    game.ctx.restore();
                }

                break;
            case 3:
                game.ctx.drawImage(game.R['home-mask'], this.home_mask_x, this.home_mask_y, 640, 183);
                game.ctx.drawImage(game.R['logo'], 20 + this.home_mask_x, this.home_mask_y, 288, 135);
                game.ctx.drawImage(game.R['ninja'], this.ninja_x, this.ninja_y, 244, 81);
                game.ctx.drawImage(game.R['home-desc'], this.home_desc_x, this.home_desc_y, 161, 91);
                
                //sandia-1
                game.ctx.save();
                game.ctx.translate(this.sandia_x, this.sandia_y);
                game.ctx.rotate( Math.PI / 4 * 2 + this.split_rad);
                game.ctx.drawImage(game.R['sandia-1'], -49, -42.5, 98, 95);
                game.ctx.restore();
                //sandia-2
                game.ctx.save();
                game.ctx.translate(this.sandia_x2, this.sandia_y2);
                game.ctx.rotate( Math.PI / 4 * 2 + this.split_rad);
                game.ctx.drawImage(game.R['sandia-2'], -49, -42.5, 98, 95);
                game.ctx.restore();
                
                //peach
                game.ctx.save();
                game.ctx.translate(this.peach_x, this.peach_y);
                game.ctx.rotate(this.peach_rad);
                game.ctx.scale(this.peach_scale, this.peach_scale);
                game.ctx.drawImage(game.R['peach'], ( - 31 * this.peach_scale) / this.peach_scale, ( - 29.5 * this.peach_scale) / this.peach_scale, 62, 59);
                game.ctx.restore();

                //切断效果渲染flash
                if(this.flash_frame < 10){
                    game.ctx.save();
                    game.ctx.translate(this.sandia_x, this.sandia_y);
                    game.ctx.rotate(this.split_rad);
                    game.ctx.drawImage(game.R['flash'], -179, -10, 358, 20);
                    game.ctx.restore();
                }

                break;
            case 4:
                for(var i = 0; i < this.fruitArr.length; i ++){
                    this.fruitArr[i].render();
                }
                //得分区域
                game.ctx.save();
                game.ctx.drawImage(game.R["score"], 10, 10, 29, 31);
                game.ctx.font = "30px 微软雅黑";
                game.ctx.fillText(this.score + '', 45, 37);
                game.ctx.restore();

                break;
            case 5:
                game.ctx.save();
                game.ctx.translate(320, 240);
                game.ctx.scale(this.gameover_scale, this.gameover_scale);
                game.ctx.drawImage(game.R["game-over"], -245, -42.5, 490, 85);
                game.ctx.restore();

                break;
            case 6:
                game.ctx.save();
                game.ctx.translate(320, 240);
                game.ctx.scale(this.waiting_scale, this.waiting_scale);
                game.ctx.drawImage(game.R["developing"], -214.5, -26.5, 429, 53);
                game.ctx.restore();
                break;
            case 7:
                game.ctx.save();
                game.ctx.globalAlpha = this.boom_alpha;
                game.ctx.fillStyle = "white";
                game.ctx.fillRect(0, 0, 640, 480);
                game.ctx.drawImage(game.R["boom"], this.boom_x - 33, this.boom_y - 34, 66, 68);
                game.ctx.restore();
            
                break;
        }
    }
    //场景切换之前的enter动作
    SceneManager.prototype.enter = function (num, x, y){
        this.sceneNumber = num;
        switch(this.sceneNumber){
            case 1:
            //几张图片的位置
                this.home_mask_x = 0;
                this.home_mask_y = -200;
                this.home_mask_idy = 10;
                this.ninja_x = 320;
                this.ninja_y = -130;
                this.ninja_idy = 10;
                this.ninja_dir = true;
                this.ninja_flag = 0;
                this.home_desc_x = -200;//18
                this.home_desc_y = 130;
                this.home_desc_idx = 5
                //坐标
                this.peach_x = 140;
                this.peach_y = 340;
                this.peach_scale = 0;
                this.peach_rad = 0;
                this.peach_flag = true;
                this.dojo_rad = 0;
                //中心坐标，sandia和new_game共用
                this.sandia_x = 380;
                this.sandia_y = 340;
                //light实例数组
                this.lightArr = [];
                //分裂时的动画的角度   
                this.split_rad = 0;
                //分裂时flash持续时间
                this.flash_frame = 0;
                //分裂时peach运动
                this.peach_x2 = 140;
                this.peach_y2 = 340;
                //分裂时sndia运动
                this.sandia_x2 = 380;
                this.sandia_y2 = 340;
                //fruit生成间隔
                this.fruit_frame = 0;
                //分数
                this.score = 0;
                //miss数量
                this.miss = 0;
                //结束界面
                this.gameover_scale = 0;
                //管理水果实例
                this.fruitArr = [];

                this.waiting_scale = 0;
                this.waiting_frame = 0;

                game.menu.play();
                break;

            case 2:

            
                break;
            case 3:

            
                break;
            case 4:
                game.startaudio.play();
            
                break;
            case 5:
                game.over.play();
                this.gameover_scale = 0;
                this.gameover_delay = 0;
                break;
            case 6:
                break;
            case 7:
                this.boom_x = x;
                this.boom_y = y;
                this.boom_alpha = 0.2;
                this.boom_alpha_change = 0.1;
                this.boom_delay = 0;
                break;
        }
    }
    //绑定事件
    SceneManager.prototype.bindEvent = function (){
        var self = this;
        game.canvas.onmousedown = function (e){
            var e = e || window.event;
            var start_x = e.offsetX;
            var start_y = e.offsetY;
            var mouse_x = e.offsetX;
            var mouse_y = e.offsetY;
            game.canvas.onmousemove = function (e){
                var e = e || window.event;
                //保存上一个鼠标坐标，并记录当前的鼠标坐标
                start_x = mouse_x;
                start_y = mouse_y;
                mouse_x = e.offsetX;
                mouse_y = e.offsetY;
                // console.log(mouse_x,mouse_y);
                //调用light类进行实例化小线段
                new Light(start_x, start_y, mouse_x, mouse_y);
            }
        }
        document.onmouseup = function (){
            game.canvas.onmousemove = null;
        }
        game.canvas.onclick = function (){
            if(self.sceneNumber == 5 && self.gameover_delay > 100){
                self.enter(1);
            }
            if(self.sceneNumber == 1){
                game.menu.play();
            }
        }
        
    }
    
})()