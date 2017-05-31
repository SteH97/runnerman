// Поведение героя во время прыжка: 
// спрайт вверх и вниз, ослабление на пути вверх и ослабление на пути вниз.

BounceBehavior = function (riseTime, fallTime, distance) {
   this.riseTime = riseTime || 1000;
   this.fallTime = fallTime || 1000;
   this.distance = distance || 100;

   this.riseTimer = new AnimationTimer(this.riseTime,
                                       AnimationTimer.makeEaseOutTransducer(1.2));

   this.fallTimer = new AnimationTimer(this.fallTime,
                                       AnimationTimer.makeEaseInTransducer(1.2));
   this.paused = false;
}

BounceBehavior.prototype = {
   pause: function() {
      if (!this.riseTimer.isPaused()) {
         this.riseTimer.pause();
      }

      if (!this.fallTimer.isPaused()) {
         this.fallTimer.pause();
      }

      this.paused = true;
   },

   unpause: function() {
      if (this.riseTimer.isPaused()) {
         this.riseTimer.unpause();
      }

      if (this.fallTimer.isPaused()) {
         this.fallTimer.unpause();
      }

      this.paused = false;
   },
   
   startRising: function (sprite) {
      this.baseline = sprite.top;
      this.bounceStart = sprite.top;

      this.riseTimer.start();
   },
      
   rise: function (sprite) {
      var elapsedTime = this.riseTimer.getElapsedTime();
      sprite.top = this.baseline - parseFloat(
                      (elapsedTime / this.riseTime) * this.distance);
   },

   finishRising: function (sprite) {
      this.riseTimer.stop();
      this.baseline = sprite.top;
      this.fallTimer.start();
   },
      
   isFalling: function () {
      return this.fallTimer.isRunning();
   },
      
   isRising: function () {
      return this.riseTimer.isRunning();
   },

   fall: function (sprite) {
      var elapsedTime = this.fallTimer.getElapsedTime();  
      sprite.top = this.baseline +
      parseFloat((elapsedTime / this.fallTime) * this.distance);
   },

   finishFalling: function (sprite) {
      this.fallTimer.stop();
      sprite.top = this.bounceStart;
      this.startRising(sprite);
   },
      
   execute: function(sprite, time, fps) {
      
      if (this.paused || !this.isRising() && ! this.isFalling()) {
         this.startRising(sprite);
         return;
      }

      if(this.isRising()) {  
         if(!this.riseTimer.isExpired()) {  
            this.rise(sprite);
         }
         else {  
            this.finishRising(sprite);
         }
      }
      else if(this.isFalling()) { 
         if(!this.fallTimer.isExpired()) {     
            this.fall(sprite);
         }
         else { 
            this.finishFalling(sprite);
         }
      }
   }
};
