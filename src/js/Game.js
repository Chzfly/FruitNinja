(function (){
    var Game = window.Game = function (){
        //获取canvas节点
        this.canvas = document.querySelector('#ninja');
        this.ctx = this.canvas.getContext('2d');
        console.log(this.ctx);
        //获取音频节点
        this.splatter = document.getElementById('splatter');
        this.throw = document.getElementById('throw');
        this.boom = document.getElementById('boom');
        this.menu = document.getElementById('menu');
        this.over = document.getElementById('over');
        this.startaudio = document.getElementById('start');
        //主定时器标识
        this.timer = null;
        //场景管理器实例的标识
        this.scene = null;

        //加载资源并启动
        this.R = {
            "logo" : "./src/images/logo.png",
            "home-mask" : "./src/images/home-mask.png",
            "home-desc" : "./src/images/home-desc.png",
            "ninja" : "./src/images/ninja.png",
            "dojo" : "./src/images/dojo.png",
            "new-game" : "./src/images/new-game.png",
            "quit" : "./src/images/quit.png",
            "new" : "./src/images/new.png",
            "score" : "./src/images/score.png",
            "shadow" : "./src/images/shadow.png",
            "x" : "./src/images/x.png",
            "xf" : "./src/images/xf.png",
            "xx" : "./src/images/xx.png",
            "xxf" : "./src/images/xxf.png",
            "xxx" : "./src/images/xxx.png",
            "xxxf" : "./src/images/xxxf.png",
            "flash" : "./src/images/flash.png",
            "game-over" : "./src/images/game-over.png",
            "apple" : "./src/images/fruit/apple.png",
            "apple-1" : "./src/images/fruit/apple-1.png",
            "apple-2" : "./src/images/fruit/apple-2.png",
            "banana" : "./src/images/fruit/banana.png",
            "banana-2" : "./src/images/fruit/banana-1.png",
            "banana-1" : "./src/images/fruit/banana-2.png",
            "boom" : "./src/images/fruit/boom.png",
            "peach" : "./src/images/fruit/peach.png",
            "peach-1" : "./src/images/fruit/peach-1.png",
            "peach-2" : "./src/images/fruit/peach-2.png",
            "sandia" : "./src/images/fruit/sandia.png",
            "sandia-1" : "./src/images/fruit/sandia-1.png",
            "sandia-2" : "./src/images/fruit/sandia-2.png",
            "strawberry" : "./src/images/fruit/strawberry.png",
            "strawberry-1" : "./src/images/fruit/strawberry-1.png",
            "strawberry-2" : "./src/images/fruit/strawberry-2.png",
            "developing" : "./src/images/developing.png"
        }
        this.allCount = Object.keys(this.R).length;
        this.count = 0;
        var self = this;
        //遍历R引入图片资源
        for(k in this.R){
            var src = this.R[k];
            this.R[k] = new Image();
            this.R[k].src = src;
            this.R[k].onload = function (){
                self.count ++;
                //显示资源加载进度
                self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
                self.ctx.font = "16px 微软雅黑";
                self.ctx.fillStyle = "yellow";
                self.ctx.fillText('正在加载资源：' + self.count + "/" + self.allCount, 15, 25);
                if(self.count == self.allCount){
                    //资源加载完毕后启动游戏
                    self.start();
                }
            }
        }
    }
    Game.prototype.start = function (){
        console.log('游戏启动了！');
        //创建新的场景管理器
        this.scene = new SceneManager();
        var self = this;
        //启动主定时器，持续刷新页面，并且将主动定时器贴上我们已经预留出来的标签timer
        this.timer = setInterval(function (){
            //在定时器中进行清屏、更新、渲染来展现游戏动画
            self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
            //对场景管理器进行持续更新和渲染
            self.scene.update();
            self.scene.render();
            //遍历light数组，对追光进行更新和渲染
            for(var i = 0; i < self.scene.lightArr.length; i ++){
               
                self.scene.lightArr[i].update();
                self.scene.lightArr[i] && self.scene.lightArr[i].render();
            }
            //打印场景编号，方便调试
            // self.ctx.fillText("当前场景号："  + self.scene.sceneNumber, 15,125);
        },20);

    }
})()