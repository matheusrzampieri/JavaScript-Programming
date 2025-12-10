import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';
import { UI } from './UI.js';

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(width, height, skin, muted) {
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 4;

            if (skin) {
                const p = document.getElementById('player');
                if (p) p.src = skin;
            }

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);

            this.enemies = [];
            this.particles = [];
            this.collisions = [];

            this.enemyTimer = 0;
            this.enemyInterval = 1000;

            this.maxParticles = 200;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.time = 0;                  
            this.winningScore = 25;
            this.gameOver = false;
            this.lives = 5;

            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();

            this.audio = {
                boom: document.getElementById('boom_sfx'),
                started: false,
                muted: muted || false,

                start() {
                    if (this.started || !this.boom) return;
                    this.started = true;

                    this.boom.play().then(() => {
                        this.boom.pause();
                        this.boom.currentTime = 0;
                    }).catch(() => {});
                },

                playBoom() {
                    if (!this.boom || this.muted) return;
                    const sfx = this.boom.cloneNode();
                    sfx.volume = 0.9;
                    sfx.play().catch(() => {});
                }
            };
        }

        update(deltaTime) {
            this.time += deltaTime;

            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(e => e.update(deltaTime));
            this.particles.forEach(p => p.update(deltaTime));
            this.collisions.forEach(c => c.update(deltaTime));

            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }

            this.enemies = this.enemies.filter(e => !e.markedForDeletion);
            this.particles = this.particles.filter(p => !p.markedForDeletion);
            this.collisions = this.collisions.filter(c => !c.markedForDeletion);
        }

        draw(ctx) {
            this.background.draw(ctx);
            this.player.draw(ctx);
            this.enemies.forEach(e => e.draw(ctx));
            this.particles.forEach(p => p.draw(ctx));
            this.collisions.forEach(c => c.draw(ctx));
            this.UI.draw(ctx);
        }

        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this));
            } else if (this.speed > 0) {
                this.enemies.push(new ClimbingEnemy(this));
            }
            this.enemies.push(new FlyingEnemy(this));
        }
    }

    let lastTime = 0;
    let anim = null;
    window.gameInstance = null;

    function animate(timeStamp) {

        if (!lastTime) lastTime = timeStamp;      

        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (window.gameInstance) {
            window.gameInstance.update(deltaTime);
            window.gameInstance.draw(ctx);
        }

        if (window.gameInstance && !window.gameInstance.gameOver) {
            anim = requestAnimationFrame(animate);
        }
    }

    window.stopGame = () => {
        if (anim) cancelAnimationFrame(anim);
        anim = null;
    };

    window.createNewGame = (skin, muted) => {
        window.stopGame();
        lastTime = 0;

        window.gameInstance = new Game(canvas.width, canvas.height, skin, muted);

        window.gameInstance.time = 0;

        window.gameInstance.audio.start();
        anim = requestAnimationFrame(animate);
    };

    window.createNewGame();
});
