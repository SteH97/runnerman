var RunnerMan =  function () {
   this.canvas = document.getElementById('game-canvas'),
   this.context = this.canvas.getContext('2d'),

   // HTML элементы........................................................
   
   this.toast = document.getElementById('toast'),

   // Счет игрока.............................................................

   this.scoreElement = document.getElementById('score');
   this.score = 0;

   // Окно после проигрыша...........................................................

   this.creditsElement = document.getElementById('credits');
   this.newGameLink = document.getElementById('new-game-link');

   // Иконка жизни.............................................................

   this.livesElement   = document.getElementById('lives');
   this.lifeIconLeft   = document.getElementById('life-icon-left');
   this.lifeIconMiddle = document.getElementById('life-icon-middle');
   this.lifeIconRight  = document.getElementById('life-icon-right');

   this.MAX_NUMBER_OF_LIVES = 3;
   this.lives = this.MAX_NUMBER_OF_LIVES;

   // Константы............................................................

   this.LEFT = 1,
   this.RIGHT = 2,

   this.BACKGROUND_VELOCITY = 35,    // пиксели/секунду
   this.RUN_ANIMATION_RATE = 35,     // 
   this.RUNNER_JUMP_DURATION = 1000, // миллисекунды
   this.BUTTON_PACE_VELOCITY = 80,   // пиксели/секунду
   this.SNAIL_PACE_VELOCITY = 50,    // пиксели/секунду
   this.SNAIL_BOMB_VELOCITY = 550,

   this.RUBY_SPARKLE_DURATION = 200,     // миллисекунды
   this.RUBY_SPARKLE_INTERVAL = 500,     // миллисекунды
   this.SAPPHIRE_SPARKLE_DURATION = 100, // миллисекунды
   this.SAPPHIRE_SPARKLE_INTERVAL = 300, // миллисекунды
   this.SAPPHIRE_BOUNCE_RISE_DURATION = 80, // миллисекунды

   this.GRAVITY_FORCE = 9.81,
   this.PIXELS_PER_METER = this.canvas.width / 10; 

   this.PAUSED_CHECK_INTERVAL = 200,
   this.DEFAULT_TOAST_TIME = 3000, // 3 секунды

   this.EXPLOSION_CELLS_HEIGHT = 62,
   this.EXPLOSION_DURATION = 1500,

   this.NUM_TRACKS = 3,

   this.PLATFORM_HEIGHT = 8,  
   this.PLATFORM_STROKE_WIDTH = 2,
   this.PLATFORM_STROKE_STYLE = 'rgb(0,0,0)',

   // Скорость прокрутки платформ. Быстрее в разы фона.

   this.PLATFORM_VELOCITY_MULTIPLIER = 4.35,
   
   // Ячейки спрайтов................................................

   this.RUNNER_CELLS_WIDTH = 40, 
   this.RUNNER_CELLS_HEIGHT = 52, 

   this.RUNNER_HEIGHT = 43,
   this.RUNNER_JUMP_HEIGHT = 120,

   this.RUN_ANIMATION_INITIAL_RATE = 0,

   this.BAT_CELLS_HEIGHT = 34, 

   this.BEE_CELLS_HEIGHT = 50,
   this.BEE_CELLS_WIDTH  = 50,

   this.BUTTON_CELLS_HEIGHT  = 20,
   this.BUTTON_CELLS_WIDTH   = 31,

   this.COIN_CELLS_HEIGHT = 30,
   this.COIN_CELLS_WIDTH  = 30,

   this.RUBY_CELLS_HEIGHT = 30,
   this.RUBY_CELLS_WIDTH = 35,

   this.SAPPHIRE_CELLS_HEIGHT = 30,
   this.SAPPHIRE_CELLS_WIDTH  = 35,

   this.SNAIL_BOMB_CELLS_HEIGHT = 20,
   this.SNAIL_BOMB_CELLS_WIDTH  = 20,

   this.SNAIL_CELLS_HEIGHT = 34,
   this.SNAIL_CELLS_WIDTH  = 64,

   this.INITIAL_BACKGROUND_VELOCITY = 0,
   this.INITIAL_BACKGROUND_OFFSET = 0,
   this.INITIAL_RUNNER_LEFT = 50,
   this.INITIAL_RUNNER_TRACK = 1,
   this.INITIAL_RUNNER_VELOCITY = 0,

   // Пауза............................................................
   
   this.paused = false,
   this.pauseStartTime = 0,
   this.totalTimePaused = 0,

   this.windowHasFocus = true,

   // Расположение по Y...................................................

   this.TRACK_1_BASELINE = 323,
   this.TRACK_2_BASELINE = 223,
   this.TRACK_3_BASELINE = 123,

   // Изображения............................................................
   
   this.background  = new Image(),
   this.spritesheet = new Image(),

   // Время..............................................................
   
   this.lastAnimationFrameTime = 0,
   this.fps = 60,

   // Translation offsets...............................................
   
   this.backgroundOffset = this.INITIAL_BACKGROUND_OFFSET,
   this.spriteOffset = this.INITIAL_BACKGROUND_OFFSET,

   // Скорость........................................................

   this.bgVelocity = this.INITIAL_BACKGROUND_VELOCITY,
   this.platformVelocity,

   // Ячейки спрайтов................................................

   this.BACKGROUND_WIDTH = 1102;
   this.BACKGROUND_HEIGHT = 400;

   this.RUNNER_CELLS_WIDTH = 50; 
   this.RUNNER_CELLS_HEIGHT = 54;

   this.BAT_CELLS_HEIGHT = 34; 

   this.BEE_CELLS_HEIGHT = 50;
   this.BEE_CELLS_WIDTH  = 50;

   this.BUTTON_CELLS_HEIGHT  = 20;
   this.BUTTON_CELLS_WIDTH   = 31;

   this.COIN_CELLS_HEIGHT = 30;
   this.COIN_CELLS_WIDTH  = 30;
   
   this.EXPLOSION_CELLS_HEIGHT = 62;

   this.RUBY_CELLS_HEIGHT = 30;
   this.RUBY_CELLS_WIDTH = 35;

   this.SAPPHIRE_CELLS_HEIGHT = 30;
   this.SAPPHIRE_CELLS_WIDTH  = 35;

   this.SNAIL_BOMB_CELLS_HEIGHT = 20;
   this.SNAIL_BOMB_CELLS_WIDTH  = 20;

   this.SNAIL_CELLS_HEIGHT = 34;
   this.SNAIL_CELLS_WIDTH  = 64;

   // Ячейки спрайтов.........................

   this.batCells = [
      { left: 3,   top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 41,  top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
      { left: 93,  top: 0, width: 36, height: this.BAT_CELLS_HEIGHT },
      { left: 132, top: 0, width: 46, height: this.BAT_CELLS_HEIGHT },
   ];

   this.batRedEyeCells = [
      { left: 185, top: 0, 
        width: 36, height: this.BAT_CELLS_HEIGHT },

      { left: 222, top: 0, 
        width: 46, height: this.BAT_CELLS_HEIGHT },

      { left: 273, top: 0, 
        width: 36, height: this.BAT_CELLS_HEIGHT },

      { left: 313, top: 0, 
        width: 46, height: this.BAT_CELLS_HEIGHT },
   ];
   
   this.beeCells = [
      { left: 5,   top: 234, width: this.BEE_CELLS_WIDTH,
                            height: this.BEE_CELLS_HEIGHT },

      { left: 75,  top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT },

      { left: 145, top: 234, width: this.BEE_CELLS_WIDTH, 
                            height: this.BEE_CELLS_HEIGHT }
   ];
   
   this.blueCoinCells = [
      { left: 5, top: 540, width: this.COIN_CELLS_WIDTH, 
                           height: this.COIN_CELLS_HEIGHT },

      { left: 5 + this.COIN_CELLS_WIDTH, top: 540,
        width: this.COIN_CELLS_WIDTH, 
        height: this.COIN_CELLS_HEIGHT }
   ];

   this.explosionCells = [
      { left: 3,   top: 48, 
        width: 52, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 63,  top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 146, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 233, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 308, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 392, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT },
      { left: 473, top: 48, 
        width: 70, height: this.EXPLOSION_CELLS_HEIGHT }
   ];
  
   this.blueButtonCells = [
      { left: 10,   top: 192, width: this.BUTTON_CELLS_WIDTH,
                            height: this.BUTTON_CELLS_HEIGHT },

      { left: 53,  top: 192, width: this.BUTTON_CELLS_WIDTH, 
                            height: this.BUTTON_CELLS_HEIGHT }
   ];

   this.goldCoinCells = [
      { left: 65, top: 540, width: this.COIN_CELLS_WIDTH, 
                            height: this.COIN_CELLS_HEIGHT },
      { left: 96, top: 540, width: this.COIN_CELLS_WIDTH, 
                            height: this.COIN_CELLS_HEIGHT },
      { left: 128, top: 540, width: this.COIN_CELLS_WIDTH, 
                             height: this.COIN_CELLS_HEIGHT },
   ];

   this.goldButtonCells = [
      { left: 90,   top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT },

      { left: 132,  top: 190, width: this.BUTTON_CELLS_WIDTH,
                              height: this.BUTTON_CELLS_HEIGHT }
   ];

   this.rubyCells = [
      { left: 185,   top: 138, width: this.SAPPHIRE_CELLS_WIDTH,
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 220,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 258,  top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 294, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT },

      { left: 331, top: 138, width: this.SAPPHIRE_CELLS_WIDTH, 
                             height: this.SAPPHIRE_CELLS_HEIGHT }
   ];

   this.runnerCellsRight = [
      { left: 414, top: 385, 
        width: 47, height: this.RUNNER_CELLS_HEIGHT },

      { left: 362, top: 385, 
         width: 44, height: this.RUNNER_CELLS_HEIGHT },

      { left: 314, top: 385, 
         width: 39, height: this.RUNNER_CELLS_HEIGHT },

      { left: 265, top: 385, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 205, top: 385, 
         width: 49, height: this.RUNNER_CELLS_HEIGHT },

      { left: 150, top: 385, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 96,  top: 385, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 45,  top: 385, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT },

      { left: 0,   top: 385, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT }
   ],

   this.runnerCellsLeft = [
      { left: 0,   top: 305, 
         width: 47, height: this.RUNNER_CELLS_HEIGHT },

      { left: 55,  top: 305, 
         width: 44, height: this.RUNNER_CELLS_HEIGHT },

      { left: 107, top: 305, 
         width: 39, height: this.RUNNER_CELLS_HEIGHT },

      { left: 152, top: 305, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 208, top: 305, 
         width: 49, height: this.RUNNER_CELLS_HEIGHT },

      { left: 265, top: 305, 
         width: 46, height: this.RUNNER_CELLS_HEIGHT },

      { left: 320, top: 305, 
         width: 42, height: this.RUNNER_CELLS_HEIGHT },

      { left: 380, top: 305, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT },

      { left: 425, top: 305, 
         width: 35, height: this.RUNNER_CELLS_HEIGHT },
   ],

   this.sapphireCells = [
      { left: 3,   top: 138, width: this.RUBY_CELLS_WIDTH,
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 39,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 76,  top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 112, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT },

      { left: 148, top: 138, width: this.RUBY_CELLS_WIDTH, 
                             height: this.RUBY_CELLS_HEIGHT }
   ];

   this.snailBombCells = [
      { left: 40, top: 512, width: 30, height: 20 },
      { left: 2, top: 512, width: 30, height: 20 }
   ];

   this.snailCells = [
      { left: 142, top: 466, width: this.SNAIL_CELLS_WIDTH,
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 75,  top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },

      { left: 2,   top: 466, width: this.SNAIL_CELLS_WIDTH, 
                             height: this.SNAIL_CELLS_HEIGHT },
   ]; 

   // Расположение спрайта.......................................................

   this.batData = [
      { left: 100,  
         top: this.TRACK_2_BASELINE - this.BAT_CELLS_HEIGHT },

      { left: 610,  
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },

      { left: 1150, 
         top: this.TRACK_2_BASELINE - 3*this.BAT_CELLS_HEIGHT },

      { left: 1720, 
         top: this.TRACK_2_BASELINE - 2*this.BAT_CELLS_HEIGHT },

      { left: 1960, 
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT }, 

      { left: 2200, 
         top: this.TRACK_3_BASELINE - this.BAT_CELLS_HEIGHT },

      { left: 2380, 
         top: this.TRACK_3_BASELINE - 2*this.BAT_CELLS_HEIGHT },
   ];
   
   this.beeData = [
      { left: 200,  top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 340,  top: this.TRACK_2_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 550,  top: this.TRACK_1_BASELINE - this.BEE_CELLS_HEIGHT },
      { left: 750,  
         top: this.TRACK_1_BASELINE - 1.5*this.BEE_CELLS_HEIGHT },

      { left: 944,  
         top: this.TRACK_2_BASELINE - 1.25*this.BEE_CELLS_HEIGHT },

      { left: 1550, top: 155 },
      { left: 2225, top: 135 },
      { left: 2200, top: 275 },
      { left: 2450, top: 275 },
   ];
   
   this.buttonData = [
      { platformIndex: 7 },
      { platformIndex: 12 },
   ];

   this.coinData = [
      { left: 270,  
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 489,  
         top: this.TRACK_3_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 620,  
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 833,  
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1050, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1450, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1670, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1870, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 1930, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 2200, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 2320, 
         top: this.TRACK_2_BASELINE - this.COIN_CELLS_HEIGHT }, 

      { left: 2360, 
         top: this.TRACK_1_BASELINE - this.COIN_CELLS_HEIGHT }, 
   ];   

   // Платформы.........................................................

   this.platformData = [
      // Экран 1.......................................................
      {
         left:      10,
         width:     210,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200, 200, 60)',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      {  left:      240,
         width:     110,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(110,150,255)',
         opacity:   1.0,
         track:     2,
         pulsate:   false,
      },

      {  left:      400,
         width:     125,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(250,0,0)',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      623,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(255,255,0)',
         opacity:   0.8,
         track:     1,
         pulsate:   false,
      },

      // Экран 2.......................................................
               
      {  left:      810,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,0)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1025,
         width:     150,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(80,140,230)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1200,
         width:     105,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      {  left:      1400,
         width:     180,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     1,
         pulsate:   false,
      },

      // Экран 3.......................................................
               
      {  left:      1625,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'cornflowerblue',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      1800,
         width:     250,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
         pulsate:   false
      },

      {  left:      2000,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'rgb(200,200,80)',
         opacity:   1.0,
         track:     2,
         pulsate:   false
      },

      {  left:      2100,
         width:     100,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'aqua',
         opacity:   1.0,
         track:     3,
         pulsate:   false
      },

      // Экран 4.......................................................

      {  left:      2269,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'gold',
         opacity:   1.0,
         track:     1,
         pulsate:   true
      },

      {  left:      2500,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     2,
         pulsate:   true
      },

      {  left:      2800,
         width:     200,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: 'cornflowerblue',
         opacity:   1.0,
         track:     3,
         pulsate:   true
      },

      {  left:      2900,
         width:     300,
         height:    this.PLATFORM_HEIGHT,
         fillStyle: '#2b950a',
         opacity:   1.0,
         track:     1,
         pulsate:   true
      },
   ];

   this.rubyData = [
      { left: 160,  
         top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 880,  
         top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 1100, 
         top: this.TRACK_2_BASELINE - this.RUBY_CELLS_HEIGHT }, 

      { left: 1475, 
         top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },

      { left: 2400, 
         top: this.TRACK_1_BASELINE - this.RUBY_CELLS_HEIGHT },
   ];

   this.sapphireData = [
      { left: 680,  
         top: this.TRACK_1_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 1700, 
         top: this.TRACK_2_BASELINE - this.SAPPHIRE_CELLS_HEIGHT },

      { left: 2056, 
         top: this.TRACK_2_BASELINE - 3*this.SAPPHIRE_CELLS_HEIGHT/2 },
   ];

   this.smokingHoleData = [
      { left: 248,  top: this.TRACK_2_BASELINE - 22 },
      { left: 688,  top: this.TRACK_3_BASELINE + 5 },
      { left: 1352,  top: this.TRACK_2_BASELINE - 18 },
   ];
   
   this.snailData = [
      { platformIndex: 13 },
   ];
   // Спрайты (массив)...........................................................

   this.bats         = [],
   this.bees         = [], 
   this.buttons      = [],
   this.coins        = [],
   this.platforms    = [],
   this.rubies       = [],
   this.sapphires    = [],
   this.snails       = [],
   
   // Сам конструктор...................................................

   this.runnerArtist = new SpriteSheetArtist(this.spritesheet,
      this.runnerCellsRight),

   this.platformArtist = {
      draw: function (sprite, context) {
         var top;
         
         context.save();

         top = runnerMan.calculatePlatformTop(sprite.track);

         context.lineWidth = runnerMan.PLATFORM_STROKE_WIDTH;
         context.strokeStyle = runnerMan.PLATFORM_STROKE_STYLE;
         context.fillStyle = sprite.fillStyle;

         context.strokeRect(sprite.left, top, sprite.width, sprite.height);
         context.fillRect  (sprite.left, top, sprite.width, sprite.height);

         context.restore();
      }
   },  

   // Поведение движения спрайта...................................................

   this.runBehavior = {

      lastAdvanceTime: 0,
      
      execute: function(sprite, time, fps) {
         if (sprite.runAnimationRate === 0) {
            return;
         }
         
         if (this.lastAdvanceTime === 0) {  
            this.lastAdvanceTime = time;
         }
         else if (time - this.lastAdvanceTime > 1000 / sprite.runAnimationRate) {
            sprite.artist.advance();
            this.lastAdvanceTime = time;
         }
      }
   },

   // Поведение прыжка спрайта..................................................

   this.jumpBehavior = {
      pause: function (sprite) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.pause();
         }
         else if (!sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.pause();
         }
      },

      unpause: function (sprite) {
         if (sprite.ascendAnimationTimer.isRunning()) {
            sprite.ascendAnimationTimer.unpause();
         }
         else if (sprite.descendAnimationTimer.isRunning()) {
            sprite.descendAnimationTimer.unpause();
         }
      },

      jumpIsOver: function (sprite) {
         return ! sprite.ascendAnimationTimer.isRunning() &&
         ! sprite.descendAnimationTimer.isRunning();
      },

      // Восхождение...............................................................

      isAscending: function (sprite) {
         return sprite.ascendAnimationTimer.isRunning();
      },
      
      ascend: function (sprite) {
         var elapsed = sprite.ascendAnimationTimer.getElapsedTime(),
         deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;
         sprite.top = sprite.verticalLaunchPosition - deltaH;
      },

      isDoneAscending: function (sprite) {
         return sprite.ascendAnimationTimer.getElapsedTime() > sprite.JUMP_DURATION/2;
      },
      
      finishAscent: function (sprite) {
         sprite.jumpApex = sprite.top;
         sprite.ascendAnimationTimer.stop();
         sprite.descendAnimationTimer.start();
      },
      
      // Спуск.............................................................

      isDescending: function (sprite) {
         return sprite.descendAnimationTimer.isRunning();
      },

      descend: function (sprite, verticalVelocity, fps) {
         var elapsed = sprite.descendAnimationTimer.getElapsedTime(),
         deltaH  = elapsed / (sprite.JUMP_DURATION/2) * sprite.JUMP_HEIGHT;

         sprite.top = sprite.jumpApex + deltaH;
      },
      
      isDoneDescending: function (sprite) {
         return sprite.descendAnimationTimer.getElapsedTime() > sprite.JUMP_DURATION/2;
      },

      finishDescent: function (sprite) {
         sprite.stopJumping();

         if (runnerMan.isOverPlatform(sprite) !== -1) {
            sprite.top = sprite.verticalLaunchPosition;
         }
         else {
            sprite.fall(runnerMan.GRAVITY_FORCE *
               (sprite.descendAnimationTimer.getElapsedTime()/1000) *
               runnerMan.PIXELS_PER_METER);
         }
      },
      
      execute: function(sprite, time, fps) {
         if ( ! sprite.jumping || sprite.exploding) {
            return;
         }

         if (this.jumpIsOver(sprite)) {
            sprite.jumping = false;
            return;
         }

         if (this.isAscending(sprite)) {
            if ( ! this.isDoneAscending(sprite)) { this.ascend(sprite); }
            else                                 { this.finishAscent(sprite); }
         }
         else if (this.isDescending(sprite)) {
            if ( ! this.isDoneDescending(sprite)) { this.descend(sprite); }
            else                                  { this.finishDescent(sprite); }
         }
      } 
   },

   // Падение бегуна..................................................

   this.fallBehavior = {
      isOutOfPlay: function (sprite) {
         return sprite.top > runnerMan.TRACK_1_BASELINE;
      },

      willFallBelowCurrentTrack: function (sprite, deltaY) {
         return sprite.top + sprite.height + deltaY >
         runnerMan.calculatePlatformTop(sprite.track);
      },

      fallOnPlatform: function (sprite) {
         sprite.top = runnerMan.calculatePlatformTop(sprite.track) - sprite.height;
         sprite.stopFalling();
      },

      setSpriteVelocity: function (sprite) {
         var fallingElapsedTime;

         sprite.velocityY = sprite.initialVelocityY + runnerMan.GRAVITY_FORCE *
         (sprite.fallAnimationTimer.getElapsedTime()/1000) *
         runnerMan.PIXELS_PER_METER;
      },

      calculateVerticalDrop: function (sprite, fps) {
         return sprite.velocityY / fps;
      },

      isPlatformUnderneath: function (sprite) {
         return runnerMan.isOverPlatform(sprite) !== -1;
      },
      
      execute: function (sprite, time, fps) {
         var deltaY;

         if (sprite.jumping) {
            return;
         }

         if (this.isOutOfPlay(sprite) || sprite.exploding) {
            if (sprite.falling) {
               sprite.stopFalling();
            }
            return;
         }
         
         if (!sprite.falling) {
            if (!sprite.exploding && !this.isPlatformUnderneath(sprite)) {
               sprite.fall();
            }
            return;
         }

         this.setSpriteVelocity(sprite);
         deltaY = this.calculateVerticalDrop(sprite, fps);

         if (!this.willFallBelowCurrentTrack(sprite, deltaY)) {
            sprite.top += deltaY;
         }
         else { // will fall below current track

            if (this.isPlatformUnderneath(sprite)) {
               this.fallOnPlatform(sprite);
               sprite.stopFalling();
            }
            else {
               sprite.track--;

               sprite.top += deltaY;

               if (sprite.track === 0) {
                  runnerMan.loseLife();
                  sprite.stopFalling();
                  runnerMan.reset();
                  runnerMan.fadeAndRestoreCanvas();
               }
            }
         }
      }
   },

   // Поведение столкновения бегуна...............................................

   this.collideBehavior = {
      execute: function (sprite, time, fps, context) {
         var otherSprite;

         for (var i=0; i < runnerMan.sprites.length; ++i) { 
            otherSprite = runnerMan.sprites[i];

            if (this.isCandidateForCollision(sprite, otherSprite)) {
               if (this.didCollide(sprite, otherSprite, context)) { 
                  this.processCollision(sprite, otherSprite);
               }
            }
         }
      },

      isCandidateForCollision: function (sprite, otherSprite) {
         return sprite !== otherSprite &&
         sprite.visible && otherSprite.visible &&
         !sprite.exploding && !otherSprite.exploding &&
         otherSprite.left - otherSprite.offset < sprite.left + sprite.width;
      }, 

      didSnailBombCollideWithRunner: function (left, top, right, bottom,
       snailBomb, context) {

         context.beginPath();
         context.rect(left, top, right - left, bottom - top);

         return context.isPointInPath(
          snailBomb.left - snailBomb.offset + snailBomb.width/2,
          snailBomb.top + snailBomb.height/2);
      },

      didRunnerCollideWithOtherSprite: function (left, top, right, bottom,
        centerX, centerY,
        otherSprite, context) {

         context.beginPath();
         context.rect(otherSprite.left - otherSprite.offset, otherSprite.top,
           otherSprite.width, otherSprite.height);
         
         return context.isPointInPath(left,    top)     ||
         context.isPointInPath(right,   top)     ||

         context.isPointInPath(centerX, centerY) ||

         context.isPointInPath(left,    bottom)  ||
         context.isPointInPath(right,   bottom);
      },

      didCollide: function (sprite, otherSprite, context) {
         var MARGIN_TOP = 15,
         MARGIN_LEFT = 15,
         MARGIN_RIGHT = 15,
         MARGIN_BOTTOM = 10,
         left = sprite.left + sprite.offset + MARGIN_LEFT,
         right = sprite.left + sprite.offset + sprite.width - MARGIN_RIGHT,
         top = sprite.top + MARGIN_TOP,
         bottom = sprite.top + sprite.height - MARGIN_BOTTOM,
         centerX = left + sprite.width/2,
         centerY = sprite.top + sprite.height/2;

         if (otherSprite.type === 'snail bomb') {
            return this.didSnailBombCollideWithRunner(left, top, right, bottom,
               otherSprite, context);
         }
         else {
            return this.didRunnerCollideWithOtherSprite(left, top, right, bottom,
             centerX, centerY,
             otherSprite, context);
         }
      },

      adjustScore: function (otherSprite) {
         if (otherSprite.value) {
            runnerMan.score += otherSprite.value;
            runnerMan.score = runnerMan.score < 0 ? 0 : runnerMan.score;
            runnerMan.scoreElement.innerHTML = runnerMan.score;
         }
      }, 

      detonateButton: function (otherSprite) {
         otherSprite.detonating = true; 
      },

      processCollision: function (sprite, otherSprite) {
         if (otherSprite.value) { 
            this.adjustScore(otherSprite);
         }

         if ('button' === otherSprite.type && (sprite.falling || sprite.jumping)) {
            this.detonateButton(otherSprite);
         }

         if ('coin'  === otherSprite.type    ||
           'sapphire' === otherSprite.type ||
           'ruby' === otherSprite.type     || 
           'snail bomb' === otherSprite.type) {
            otherSprite.visible = false;
         }

         if ('bat' === otherSprite.type   ||
         'bee' === otherSprite.type   ||
         'snail' === otherSprite.type || 
         'snail bomb' === otherSprite.type) {
            runnerMan.explode(sprite);
            runnerMan.shake();

            setTimeout( function () {
             runnerMan.loseLife();
             runnerMan.reset();
             runnerMan.fadeAndRestoreCanvas();
            }, runnerMan.EXPLOSION_DURATION);
         }

         if (sprite.jumping && 'platform' === otherSprite.type) {
          this.processPlatformCollisionDuringJump(sprite, otherSprite);
         }
      },

      processPlatformCollisionDuringJump: function (sprite, platform) {
         var isDescending = sprite.descendAnimationTimer.isRunning();

         sprite.stopJumping();

         if (isDescending) {
            sprite.track = platform.track; 
            sprite.top = runnerMan.calculatePlatformTop(sprite.track) - sprite.height;
         }
         else { 
            sprite.fall(); 
         }
      },
   };

   // Общее поведение темпа...................................................

   this.paceBehavior = {
      execute: function (sprite, time, fps) {
         var sRight = sprite.left + sprite.width,
         pRight = sprite.platform.left + sprite.platform.width,
         pixelsToMove = sprite.velocityX / fps;

         if (sprite.direction === undefined) {
            sprite.direction = runnerMan.RIGHT;
         }

         if (sprite.velocityX === 0) {
            if (sprite.type === 'snail') {
               sprite.velocityX = runnerMan.SNAIL_PACE_VELOCITY;
            }
            else {
               sprite.velocityX = runnerMan.BUTTON_PACE_VELOCITY;
            }
         }

         if (sRight > pRight && sprite.direction === runnerMan.RIGHT) {
            sprite.direction = runnerMan.LEFT;
         }
         else if (sprite.left < sprite.platform.left &&
            sprite.direction === runnerMan.LEFT) {
            sprite.direction = runnerMan.RIGHT;
         }

         if (sprite.direction === runnerMan.RIGHT) {
          sprite.left += pixelsToMove;
         }
         else {
          sprite.left -= pixelsToMove;
         }
      }
   };

   // Спрайт выстрела улитки....................................................

   this.snailShootBehavior = { 
      execute: function (sprite, time, fps) {
         var bomb = sprite.bomb;

         if (!runnerMan.spriteInView(sprite)) {
            return;
         }

         if (! bomb.visible && sprite.artist.cellIndex === 2) {
            bomb.left = sprite.left;
            bomb.visible = true;
         }
      }
   };

   this.snailBombMoveBehavior = {
      execute: function(sprite, time, fps) { 
         if (sprite.visible && runnerMan.spriteInView(sprite)) {
            sprite.left -= runnerMan.SNAIL_BOMB_VELOCITY / fps;
         }

         if (!runnerMan.spriteInView(sprite)) {
            sprite.visible = false;
         }
      }
   };

   // Детонация кнопки..................................................

   this.buttonDetonateBehavior = {
      execute: function(sprite, now, fps, lastAnimationFrameTime) {
         var BUTTON_REBOUND_DELAY = 1000;

         if ( ! sprite.detonating) { 
            return;
         }

         sprite.artist.cellIndex = 1; 

         runnerMan.explode(runnerMan.bees[5]);

         setTimeout( function () {
            sprite.artist.cellIndex = 0; 
            sprite.detonating = false; 
         }, BUTTON_REBOUND_DELAY);
      }
   };

   // Конструктор...........................................................

   this.runner = new Sprite('runner',           
                            this.runnerArtist,  
                            [ this.runBehavior, 
                            this.jumpBehavior,
                            this.fallBehavior,
                            this.collideBehavior
                            ]); 

   this.runner.width = this.RUNNER_CELLS_WIDTH;
   this.runner.height = this.RUNNER_CELLS_HEIGHT;

   // Все спрайты.......................................................

   this.sprites = [ this.runner ];  

   this.explosionAnimator = new SpriteAnimator(
      this.explosionCells,          
      this.EXPLOSION_DURATION,      

      function (sprite, animator) {
         sprite.exploding = false; 

         if (sprite.jumping) {
            sprite.stopJumping();
         }
         else if (sprite.falling) {
            sprite.stopFalling();
         }

         sprite.visible = true;

         if (sprite === runnerMan.runner) {
            sprite.track = 1;
            sprite.top = runnerMan.calculatePlatformTop(sprite.track) - sprite.height;
            sprite.runAnimationRate = runnerMan.RUN_ANIMATION_RATE;
         }
         sprite.artist.cellIndex = 0;
      });
};

// Прототип --------------------------------------------------

RunnerMan.prototype = {

   draw: function (now) {
      this.setPlatformVelocity();
      this.setTranslationOffsets();
      this.drawBackground();
      this.updateSprites(now);
      this.drawSprites();
   },

   setPlatformVelocity: function () {
      this.platformVelocity = this.bgVelocity * this.PLATFORM_VELOCITY_MULTIPLIER; 
   },

   setTranslationOffsets: function () {
      this.setBackgroundTranslationOffset();
      this.setSpriteTranslationOffsets();
   },
   
   setSpriteTranslationOffsets: function () {
      var i, sprite;

      this.spriteOffset += this.platformVelocity / this.fps;
      for (i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if ('runner' !== sprite.type) {
            sprite.offset = this.spriteOffset; 
         }
      }
   },

   setBackgroundTranslationOffset: function () {
      var offset = this.backgroundOffset + this.bgVelocity/this.fps;

      if (offset > 0 && offset < this.background.width) {
         this.backgroundOffset = offset;
      }
      else {
         this.backgroundOffset = 0;
      }
   },
   
   drawBackground: function () {
      this.context.save();

      this.context.globalAlpha = 1.0;
      this.context.translate(-this.backgroundOffset, 0);

      this.context.drawImage(this.background, 0, 0,
         this.background.width, this.background.height);

      this.context.drawImage(this.background, this.background.width, 0,
         this.background.width+1, this.background.height);

      this.context.restore();
   },

   calculatePlatformTop: function (track) {
      var top;
   
      if      (track === 1) { top = this.TRACK_1_BASELINE; }
      else if (track === 2) { top = this.TRACK_2_BASELINE; }
      else if (track === 3) { top = this.TRACK_3_BASELINE; }

      return top;
   },

   turnLeft: function () {
      this.bgVelocity = -this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runnerArtist.cells = this.runnerCellsLeft;
      this.runner.direction = this.LEFT;
   },

   turnRight: function () {
      this.bgVelocity = this.BACKGROUND_VELOCITY;
      this.runner.runAnimationRate = this.RUN_ANIMATION_RATE;
      this.runnerArtist.cells = this.runnerCellsRight;
      this.runner.direction = this.RIGHT;
   },         
  
   updateScoreElement: function () {
      this.scoreElement.innerHTML = this.score;
   },         

   updateLivesElement: function () {
      if (this.lives === 3) {
         this.lifeIconLeft.style.opacity   = 1.0;
         this.lifeIconMiddle.style.opacity = 1.0;
         this.lifeIconRight.style.opacity  = 1.0;
      }
      else if (this.lives === 2) {
         this.lifeIconLeft.style.opacity   = 1.0;
         this.lifeIconMiddle.style.opacity = 1.0;
         this.lifeIconRight.style.opacity  = 0;
      }
      else if (this.lives === 1) {
         this.lifeIconLeft.style.opacity   = 1.0;
         this.lifeIconMiddle.style.opacity = 0;
         this.lifeIconRight.style.opacity  = 0;
      }
      else if (this.lives === 0) {
         this.lifeIconLeft.style.opacity   = 0;
         this.lifeIconMiddle.style.opacity = 0;
         this.lifeIconRight.style.opacity  = 0;
      }
   }, 

   // Спрайты..............................................................

   equipRunner: function () {
      
      this.runner.runAnimationRate = this.RUN_ANIMATION_INITIAL_RATE,
   
      this.runner.track = this.INITIAL_RUNNER_TRACK;
      this.runner.direction = this.LEFT;
      this.runner.velocityX = this.INITIAL_RUNNER_VELOCITY;
      this.runner.left = this.INITIAL_RUNNER_LEFT;
      this.runner.top = this.calculatePlatformTop(this.runner.track) -
                        this.RUNNER_CELLS_HEIGHT;

      this.runner.artist.cells = this.runnerCellsRight;
      this.runner.offset = 0;

      this.equipRunnerForJumping();
      this.equipRunnerForFalling();
   },

   equipRunnerForFalling: function () {
      this.runner.falling = false;
      this.runner.fallAnimationTimer = new AnimationTimer();

      this.runner.fall = function (initialVelocity) {
         this.velocityY = initialVelocity || 0;
         this.initialVelocityY = initialVelocity || 0;
         this.fallAnimationTimer.start();
         this.falling = true;
      }

      this.runner.stopFalling = function () {
         this.falling = false;
         this.velocityY = 0;
         this.fallAnimationTimer.stop();
      }
   },
   
   equipRunnerForJumping: function () {
      this.runner.JUMP_DURATION = this.RUNNER_JUMP_DURATION;
      this.runner.JUMP_HEIGHT = this.RUNNER_JUMP_HEIGHT;

      this.runner.jumping = false;

      this.runner.ascendAnimationTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseOutTransducer(1.1));

      this.runner.descendAnimationTimer =
         new AnimationTimer(this.runner.JUMP_DURATION/2,
                            AnimationTimer.makeEaseInTransducer(1.1));

      this.runner.stopJumping = function () {
         this.jumping = false;
         this.ascendAnimationTimer.stop();
         this.descendAnimationTimer.stop();
         this.runAnimationRate = runnerMan.RUN_ANIMATION_RATE;
      };
      
      this.runner.jump = function () {
         if (this.jumping)
            return;

         this.runAnimationRate = 0;
         this.jumping = true;
         this.verticalLaunchPosition = this.top;
         this.ascendAnimationTimer.start();


      };
   },
   
   createPlatformSprites: function () {
      var sprite, pd; 
   
      for (var i=0; i < this.platformData.length; ++i) {
         pd = this.platformData[i];
         sprite  = new Sprite('platform', this.platformArtist);

         sprite.left      = pd.left;
         sprite.width     = pd.width;
         sprite.height    = pd.height;
         sprite.fillStyle = pd.fillStyle;
         sprite.opacity   = pd.opacity;
         sprite.track     = pd.track;
         sprite.button    = pd.button;
         sprite.pulsate   = pd.pulsate;

         sprite.top = this.calculatePlatformTop(pd.track);
   
         if (sprite.pulsate) {
            sprite.behaviors = [ new PulseBehavior(1000, 0.5) ];
         }

         this.platforms.push(sprite);
      }
   },

   shake: function () {
      var SHAKE_INTERVAL = 90,
          v = runnerMan.BACKGROUND_VELOCITY,
          ov = runnerMan.bgVelocity;
   
      this.bgVelocity = -this.BACKGROUND_VELOCITY;

      setTimeout( function (e) {
       runnerMan.bgVelocity = v;
       setTimeout( function (e) {
          runnerMan.bgVelocity = -v;
          setTimeout( function (e) {
             runnerMan.bgVelocity = v;
             setTimeout( function (e) {
                runnerMan.bgVelocity = -v;
                setTimeout( function (e) {
                   runnerMan.bgVelocity = v;
                   setTimeout( function (e) {
                      runnerMan.bgVelocity = -v;
                      setTimeout( function (e) {
                         runnerMan.bgVelocity = v;
                         setTimeout( function (e) {
                            runnerMan.bgVelocity = -v;
                            setTimeout( function (e) {
                               runnerMan.bgVelocity = v;
                               setTimeout( function (e) {
                                  runnerMan.bgVelocity = -v;
                                  setTimeout( function (e) {
                                     runnerMan.bgVelocity = v;
                                     setTimeout( function (e) {
                                        runnerMan.bgVelocity = ov;
                                     }, SHAKE_INTERVAL);
                                  }, SHAKE_INTERVAL);
                               }, SHAKE_INTERVAL);
                            }, SHAKE_INTERVAL);
                         }, SHAKE_INTERVAL);
                      }, SHAKE_INTERVAL);
                   }, SHAKE_INTERVAL);
                }, SHAKE_INTERVAL);
             }, SHAKE_INTERVAL);
          }, SHAKE_INTERVAL);
       }, SHAKE_INTERVAL);
     }, SHAKE_INTERVAL);
   },

   explode: function (sprite, silent) {
      if (sprite.exploding) {
         return;
      }

      if (sprite.jumping) {
         sprite.stopJumping();
      }

      if (sprite.runAnimationRate === 0) {
         sprite.runAnimationRate = this.RUN_ANIMATION_RATE;
      }            
      sprite.exploding = true;
      this.explosionAnimator.start(sprite, true);
   },

   blowupBees: function () {
      var i,
          numBees = runnerMan.bees.length;

      for (i=0; i < numBees; ++i) {
         bee = runnerMan.bees[i];
         if (bee.visible) {
            runnerMan.explode(bee, true);
         }
      }
   },

   blowupBats: function () {
      var i,
          numBats = runnerMan.bats.length;

      for (i=0; i < numBats; ++i) {
         bat = runnerMan.bats[i];
         if (bat.visible) {
            runnerMan.explode(bat, true);
         }
      }
   },

   // Анимация............................................................

   animate: function (now) { 
      if (runnerMan.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(runnerMan.animate);
         }, runnerMan.PAUSED_CHECK_INTERVAL);
      }
      else {
         runnerMan.draw(now);
         requestNextAnimationFrame(runnerMan.animate);
      }
   },

   togglePausedStateOfAllBehaviors: function () {
      var behavior;
   
      for (var i=0; i < this.sprites.length; ++i) { 
         sprite = this.sprites[i];

         for (var j=0; j < sprite.behaviors.length; ++j) { 
            behavior = sprite.behaviors[j];

            if (this.paused) {
               if (behavior.pause) {
                  behavior.pause(sprite);
               }
            }
            else {
               if (behavior.unpause) {
                  behavior.unpause(sprite);
               }
            }
         }
      }
   },

   togglePaused: function () {
      var now = +new Date();

      this.paused = !this.paused;
      this.togglePausedStateOfAllBehaviors();
   
      if (this.paused) {
         this.pauseStartTime = now;
      }
      else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }

   },

   // ------------------------- Инициализация ----------------------------

   start: function () {
      this.createSprites();
      this.initializeImages();
      this.equipRunner();
      this.revealToast('Good Luck!');

      document.getElementById('instructions').style.opacity =
         runnerMan.INSTRUCTIONS_OPACITY;
   },
   
   initializeImages: function () {
      var self = this;

      this.background.src = 'images/forestbackground.png';
      this.spritesheet.src = 'images/spritesheet.png';
   
      this.background.onload = function (e) {
         self.startGame();
      };
   },

   startGame: function () {
      requestNextAnimationFrame(this.animate);
   },

   restartGame: function () {
      this.hideCredits();

      this.lives = this.MAX_NUMBER_OF_LIVES;
      this.updateLivesElement();

      this.score = 0;
      this.updateScoreElement();
   },

   fadeAndRestoreCanvas: function () {
      runnerMan.canvas.style.opacity = 0.2;

      setTimeout( function () {
         runnerMan.canvas.style.opacity = 1.0;
      }, 2500);
   },

   resetRunner: function () {
      runnerMan.runner.exploding = false; 
      runnerMan.runner.visible = false;
      runnerMan.runner.opacity = runnerMan.OPAQUE;
      runnerMan.runner.artist.cells = runnerMan.runnerCellsRight;

      if (runnerMan.runner.jumping) { runnerMan.runner.stopJumping(); }
      if (runnerMan.runner.falling) { runnerMan.runner.stopFalling(); }
   },

   reset: function () {
      var CANVAS_TRANSITION_DURATION = 2000,
          CONTINUE_RUNNING_DURATION = 1000;

      this.resetRunner();

      setTimeout( function () {
         runnerMan.backgroundOffset = 
            runnerMan.INITIAL_BACKGROUND_OFFSET;

         runnerMan.spriteOffset = runnerMan.INITIAL_BACKGROUND_OFFSET;
         runnerMan.bgVelocity = runnerMan.INITIAL_BACKGROUND_VELOCITY;

         runnerMan.runner.track = 3;
         runnerMan.runner.top = runnerMan.calculatePlatformTop(runnerMan.runner.track) - 
                                runnerMan.runner.height;

         for (var i=0; i < runnerMan.sprites.length; ++i) { 
            runnerMan.sprites[i].visible = true;
         }

         setTimeout( function () {
            runnerMan.runner.runAnimationRate = 0;
         }, CONTINUE_RUNNING_DURATION);
      }, CANVAS_TRANSITION_DURATION);
   },

   loseLife: function () {
      this.lives--;
      this.updateLivesElement();

      if (this.lives === 1) {
         runnerMan.revealToast('Last chance!');
      }

      if (this.lives === 0) {
         this.gameOver();
      }
   },
         
   gameOver: function () {
      runnerMan.revealCredits();
   },

   revealLivesIcons: function () {
      var LIVES_ICON_REVEAL_DELAY = 2000;

      setTimeout( function (e) {
         runnerMan.lifeIconLeft.style.opacity = runnerMan.OPAQUE;
         runnerMan.lifeIconRight.style.opacity = runnerMan.OPAQUE;
         runnerMan.lifeIconMiddle.style.opacity = runnerMan.OPAQUE;
      }, LIVES_ICON_REVEAL_DELAY);
   },

   revealCredits: function () {
      this.creditsElement.style.display = 'block';
      this.revealLivesIcons();

      setTimeout( function () {
         runnerMan.creditsElement.style.opacity = 1.0;
      }, runnerMan.SHORT_DELAY);
   },

   hideCredits: function () {
      var CREDITS_REVEAL_DELAY = 2000;
      this.creditsElement.style.opacity = this.TRANSPARENT;

      setTimeout( function (e) {
         runnerMan.creditsElement.style.display = 'none';
      }, this.CREDITS_REVEAL_DELAY);
   },         

   positionSprites: function (sprites, spriteData) {
      var sprite;

      for (var i = 0; i < sprites.length; ++i) {
         sprite = sprites[i];

         if (spriteData[i].platformIndex) { 
            this.putSpriteOnPlatform(sprite,
               this.platforms[spriteData[i].platformIndex]);
         }
         else {
            sprite.top  = spriteData[i].top;
            sprite.left = spriteData[i].left;
         }
      }
   },

   armSnails: function () {
      var snail,
          snailBombArtist = new SpriteSheetArtist(this.spritesheet, this.snailBombCells);

      for (var i=0; i < this.snails.length; ++i) {
         snail = this.snails[i];
         snail.bomb = new Sprite('snail bomb',
                                  snailBombArtist,
                                  [ this.snailBombMoveBehavior ]);

         snail.bomb.width  = runnerMan.SNAIL_BOMB_CELLS_WIDTH;
         snail.bomb.height = runnerMan.SNAIL_BOMB_CELLS_HEIGHT;

         snail.bomb.top = snail.top + snail.bomb.height/2;
         snail.bomb.left = snail.left + snail.bomb.width/2;
         snail.bomb.visible = false;

         snail.bomb.snail = snail;

         this.sprites.push(snail.bomb);
      }
   },
   
   addSpritesToSpriteArray: function () {
      for (var i=0; i < this.platforms.length; ++i) {
         this.sprites.push(this.platforms[i]);
      }

      for (var i=0; i < this.bats.length; ++i) {
         this.sprites.push(this.bats[i]);
      }

      for (var i=0; i < this.bees.length; ++i) {
         this.sprites.push(this.bees[i]);
      }

      for (var i=0; i < this.buttons.length; ++i) {
         this.sprites.push(this.buttons[i]);
      }

      for (var i=0; i < this.coins.length; ++i) {
         this.sprites.push(this.coins[i]);
      }

      for (var i=0; i < this.rubies.length; ++i) {
         this.sprites.push(this.rubies[i]);
      }

      for (var i=0; i < this.sapphires.length; ++i) {
         this.sprites.push(this.sapphires[i]);
      }

     for (var i=0; i < this.snails.length; ++i) {
         this.sprites.push(this.snails[i]);
      }
   },

   createBatSprites: function () {
      var bat,
          batArtist = new SpriteSheetArtist(this.spritesheet, this.batCells),
    redEyeBatArtist = new SpriteSheetArtist(this.spritesheet, this.batRedEyeCells);

      for (var i = 0; i < this.batData.length; ++i) {
         if (i % 2 === 0) bat = new Sprite('bat', batArtist, [ new CycleBehavior(100)]);
         else             bat = new Sprite('bat', redEyeBatArtist, [ new CycleBehavior(100)]);

         bat.width = this.batCells[1].width;
         bat.height = this.BAT_CELLS_HEIGHT;

         this.bats.push(bat);
      }
   },

   createBeeSprites: function () {
      var bee,
          beeArtist;

      for (var i = 0; i < this.beeData.length; ++i) {
         bee = new Sprite('bee',
                          new SpriteSheetArtist(this.spritesheet, this.beeCells),
                          [ new CycleBehavior(100) ]);

         bee.width = this.BEE_CELLS_WIDTH;
         bee.height = this.BEE_CELLS_HEIGHT;

         this.bees.push(bee);
      }
   },

   createButtonSprites: function () {
      var button,
          buttonArtist = new SpriteSheetArtist(this.spritesheet,
                                               this.blueButtonCells),
      goldButtonArtist = new SpriteSheetArtist(this.spritesheet,
                                               this.goldButtonCells);

      for (var i = 0; i < this.buttonData.length; ++i) {
         if (i === this.buttonData.length - 1) {
            button = new Sprite('button',
                                 goldButtonArtist,
                                 [ this.paceBehavior ]);
         }
         else {
            button = new Sprite('button',
                                 buttonArtist, 
                                 [ this.paceBehavior,
                                   this.buttonDetonateBehavior ]);
         }

         button.width = this.BUTTON_CELLS_WIDTH;
         button.height = this.BUTTON_CELLS_HEIGHT;

         this.buttons.push(button);
      }
   },
   
   createCoinSprites: function () {
      var blueCoinArtist = new SpriteSheetArtist(this.spritesheet,
                                                 this.blueCoinCells),

          goldCoinArtist = new SpriteSheetArtist(this.spritesheet,
                                                 this.goldCoinCells),
          coin;
   
      for (var i = 0; i < this.coinData.length; ++i) {
         if (i % 2 === 0) {
            coin = new Sprite('coin', goldCoinArtist,
                              [ new CycleBehavior(500) ]);
         }
         else {
            coin = new Sprite('coin', blueCoinArtist,
                              [ new CycleBehavior(500) ]);
         }
         
         coin.width = this.COIN_CELLS_WIDTH;
         coin.height = this.COIN_CELLS_HEIGHT;
         coin.value = 50;

         coin.behaviors.push(
            new BounceBehavior(80 * i * 10,
                               50 * i * 10,
                               60 + Math.random() * 40));

         this.coins.push(coin);
      }
   },
   
   createSapphireSprites: function () {
      var sapphire,
          sapphireArtist = new SpriteSheetArtist(this.spritesheet, this.sapphireCells);
   
      for (var i = 0; i < this.sapphireData.length; ++i) {
         sapphire = new Sprite('sapphire', sapphireArtist,
                               [ new CycleBehavior(this.SAPPHIRE_SPARKLE_DURATION,
                                           this.SAPPHIRE_SPARKLE_INTERVAL),

                                 new BounceBehavior(1000, 1000, 120)
                               ]);

         sapphire.width = this.SAPPHIRE_CELLS_WIDTH;
         sapphire.height = this.SAPPHIRE_CELLS_HEIGHT;
         sapphire.value = 150;

         this.sapphires.push(sapphire);
      }
   },
   
   createRubySprites: function () {
      var ruby,
          rubyArtist = new SpriteSheetArtist(this.spritesheet, this.rubyCells);
   
      for (var i = 0; i < this.rubyData.length; ++i) {
         ruby = new Sprite('ruby', rubyArtist, [ new CycleBehavior(this.RUBY_SPARKLE_DURATION,
                                                           this.RUBY_SPARKLE_INTERVAL),

                                 new BounceBehavior(800, 600, 120)
                               ]);
         ruby.width = this.RUBY_CELLS_WIDTH;
         ruby.height = this.RUBY_CELLS_HEIGHT;
         ruby.value = 100;

         this.rubies.push(ruby);
      }
   },
   
   createSnailSprites: function () {
      var snail,
          snailArtist = new SpriteSheetArtist(this.spritesheet, this.snailCells);
   
      for (var i = 0; i < this.snailData.length; ++i) {
         snail = new Sprite('snail',
                            snailArtist,
                            [ this.paceBehavior,
                              this.snailShootBehavior,
                              new CycleBehavior(300, 1500)
                            ]);

         snail.width  = this.SNAIL_CELLS_WIDTH;
         snail.height = this.SNAIL_CELLS_HEIGHT;

         this.snails.push(snail);
      }
   },
   
   updateSprites: function (now) {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.visible && this.spriteInView(sprite)) {
            sprite.update(now, this.fps, this.context);
         }
      }
   },
   
   drawSprites: function() {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         if (sprite.visible && this.spriteInView(sprite)) {
            this.context.translate(-sprite.offset, 0);

            sprite.draw(this.context);

            this.context.translate(sprite.offset, 0);
         }
      }
   },
   
   spriteInView: function(sprite) {
      return sprite === this.runner || 
         (sprite.left + sprite.width > this.spriteOffset &&
          sprite.left < this.spriteOffset + this.canvas.width);   
   },

   isOverPlatform: function (sprite, track) {
      var p,
          index = -1,
          center = sprite.left + sprite.offset + sprite.width/2;

      if (track === undefined) { 
         track = sprite.track;
      }

      for (var i=0; i < runnerMan.platforms.length; ++i) {
         p = runnerMan.platforms[i];

         if (track === p.track) {
            if (center > p.left - p.offset && center < (p.left - p.offset + p.width)) {
               index = i;
               break;
            }
         }
      }
      return index;
   },
   
   putSpriteOnPlatform: function(sprite, platformSprite) {
      sprite.top  = platformSprite.top - sprite.height;
      sprite.left = platformSprite.left;
      sprite.platform = platformSprite;
   },
   
   createSprites: function() {  
      this.createPlatformSprites();
      
      this.createBatSprites();
      this.createBeeSprites();
      this.createButtonSprites();
      this.createCoinSprites();
      this.createRubySprites();
      this.createSapphireSprites();
      this.createSnailSprites();

      this.initializeSprites();

      this.addSpritesToSpriteArray();
   },
   
   initializeSprites: function() {  
      for (var i=0; i < runnerMan.sprites.length; ++i) { 
         runnerMan.sprites[i].offset = 0;
      }

      this.positionSprites(this.bats,       this.batData);
      this.positionSprites(this.bees,       this.beeData);
      this.positionSprites(this.buttons,    this.buttonData);
      this.positionSprites(this.coins,      this.coinData);
      this.positionSprites(this.rubies,     this.rubyData);
      this.positionSprites(this.sapphires,  this.sapphireData);
      this.positionSprites(this.snails,     this.snailData);

      this.armSnails();
   },

   // Отсчет................................................................

   revealToast: function (text, howLong) {
      howLong = howLong || this.DEFAULT_TOAST_TIME;

      toast.style.display = 'block';
      toast.innerHTML = text;

      setTimeout( function (e) {
         if (runnerMan.windowHasFocus) {
            toast.style.opacity = 1.0;
         }
      }, 50);

      setTimeout( function (e) {
         if (runnerMan.windowHasFocus) {
            toast.style.opacity = 0;
         }

         setTimeout( function (e) { 
            if (runnerMan.windowHasFocus) {
               toast.style.display = 'none'; 
            }
         }, 480);
      }, howLong);
   },
};
   
// Клавиатура.......................................................
   
window.onkeydown = function (e) {
   var key = e.keyCode;

   if (runnerMan.runner.exploding) {
      return;
   }

   if (key === 80 || (runnerMan.paused && key !== 80)) {  // 'p' 
      runnerMan.togglePaused();
   }
   
   if (key === 65 || key === 37) { // 'a' or left arrow
      runnerMan.turnLeft();
   }
   else if (key === 68 || key === 39) { // 'd' or right arrow
      runnerMan.turnRight();
   }
   else if (key === 32) { // 'space'
      if (!runnerMan.runner.jumping && !runnerMan.runner.falling) {
         runnerMan.runner.jump();
      }
   }
};

window.onblur = function (e) {  // pause if unpaused
   runnerMan.windowHasFocus = false;
   
   if (!runnerMan.paused) {
      runnerMan.togglePaused();
   }
};

window.onfocus = function (e) {  // unpause if paused
   var originalFont = runnerMan.toast.style.fontSize;

   runnerMan.windowHasFocus = true;

   if (runnerMan.paused) {
      runnerMan.toast.style.font = '128px fantasy';

      runnerMan.revealToast('3', 500); 

      setTimeout(function (e) {
         runnerMan.revealToast('2', 500); 

         setTimeout(function (e) {
            runnerMan.revealToast('1', 500); 
            setTimeout(function (e) {
               if ( runnerMan.windowHasFocus) {
                  runnerMan.togglePaused();
               }

               setTimeout(function (e) { 
                  runnerMan.toast.style.fontSize = originalFont;
               }, 2000);
            }, 1000);
         }, 1000);
      }, 1000);
   }
};

// Запуск игры.........................................................

var runnerMan = new RunnerMan();
runnerMan.start();

// Обработчик событий............................................

runnerMan.newGameLink.onclick = function (e) {
   runnerMan.restartGame();
};
