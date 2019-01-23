/**
 * 游戏类，控制游戏的分数，状态，游戏容器，提供开始和结束等功能
 * 因为当前游戏只有一个，Game这个代表了游戏的对象同时只会存在一个，不需要有多
 * 所以：我们采用单例的模式来设计这个Game对象
 * 
 * 在js中我们可以直接通过对象字面量的方式来创建一个单例对象，而不需要通过class（构造函数）来创建
 */
import WaterPolo from './WaterPolo.js';
import Bullet from './Bullet.js';
export default {
    // 水量，默认是10，当water为0的时候，表示游戏结束了
    water: 10,
    // 保存当前游戏的容器
    wrap: null,
    // 数字
    txt: null,
    value: null,
    // 保存了游戏中的所有小水球对象
    waterPolos: [],
    // 保存游戏中所有子弹的数组
    bullets: [],
    /**
     * 开始游戏的方法，当这个方法调用的时候，游戏就会初始化，用户就可以进行玩耍了
     */
    start() {
        // 处理的一些程序中逻辑错误
        console.log(123)
        if (this.wrap === null) throw new Error('请设置游戏的容器');
        this.txt.innerHTML = this.water;
        this.value.style.height = this.water * 20 + 'px';
        // 使用传统面向过程的一种方式来创建水球
        for (let i=0; i<36; i++) {
            // 一个类内部只关注有哪些特性（属性、方法），但是一些非自身的逻辑我们就在内部实现，而是通过类对外提供的方法或事件来实现
            let waterPolo = new WaterPolo( Math.floor(Math.random() * 5) );
            this.waterPolos.push(waterPolo);
            waterPolo.draw( this.wrap );
            waterPolo.onclick = ()=> {
                if (this.water > 0) {
                    this.water--;
                    this.value.style.height = this.water * 20 + 'px';
                    waterPolo.levelUp();
                    this.txt.innerHTML = this.water;
                }
            }
            waterPolo.onboom = () => {
                // ←
                let bulletLeft = new Bullet('left', 3);
                this.bullets.push(bulletLeft);
                bulletLeft.draw( this.wrap );
                bulletLeft.setPosition( waterPolo.left - 50 , waterPolo.top );
                bulletLeft.onmove = ()=> {
                    this.bulletMove(waterPolo, bulletLeft);
                }
                // →
                let bulletRight = new Bullet('right', 3);
                this.bullets.push(bulletRight);
                bulletRight.draw( this.wrap );
                bulletRight.setPosition( waterPolo.left + 50 , waterPolo.top );
                bulletRight.onmove = ()=> {
                    this.bulletMove(waterPolo, bulletRight);
                }
                // ↑
                let bulletTop = new Bullet('top', 3);
                this.bullets.push(bulletTop);
                bulletTop.draw( this.wrap );
                bulletTop.setPosition( waterPolo.left , waterPolo.top - 50 );
                bulletTop.onmove = ()=> {
                    this.bulletMove(waterPolo, bulletTop);
                }
                // ↓
                let bulletBottom = new Bullet('bottom', 3);
                this.bullets.push(bulletBottom);
                bulletBottom.draw( this.wrap );
                bulletBottom.setPosition( waterPolo.left, waterPolo.top + 50 );
                bulletBottom.onmove = ()=> {
                    this.bulletMove(waterPolo, bulletBottom);
                }
            }
        }

    },

    bulletMove(waterPolo, bullet) {
        // 碰撞检测
        // 排除发射子弹的元素与level为0的元素
        let waterPolos = this.waterPolos.filter( wp => {
            return wp != waterPolo && wp.level > 0;
        } );
        let wp = bullet.collision( waterPolos );
        // console.log(wp);
        if (wp) {
            // 如果有碰撞了，子弹就需要销毁
            bullet.destory();
            // 被碰撞的水球需要升级
            wp.levelUp();
            this.bullets = this.bullets.filter( bu => bu != bullet );
        }
        if (bullet.left < -bullet.width || bullet.left > this.wrap.offsetWidth || bullet.top < -bullet.height || bullet.top > this.wrap.offsetHeight) {
            bullet.destory();
            this.bullets = this.bullets.filter( bu => bu != bullet );
        }
        // console.log(this.bullets.length);
        if (this.bullets.length == 0) {
            let wps = this.waterPolos.filter(wp => wp.level !== 0);
            //console.log(wps.length);
            if (this.water === 0) {
                console.log('游戏结束');
                return;
            }
            if (wps.length === 0 && this.water > 0) {
                console.log('进入下一关');
                return;
            }
        }
    }

};

