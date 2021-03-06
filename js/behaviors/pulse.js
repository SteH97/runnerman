
PulseBehavior = function (time, opacityThreshold) {
   this.time = time || 1000;
   this.brightTimer = new AnimationTimer(this.time,
                                         AnimationTimer.makeEaseInTransducer(1));

   this.dimTimer = new AnimationTimer(this.time, 
                                         AnimationTimer.makeEaseOutTransducer(1));
   this.opacityThreshold = opacityThreshold;
},

PulseBehavior.prototype = { 

   pause: function() {
      if (!this.dimTimer.isPaused()) {
         this.dimTimer.pause();
      }

      if (!this.brightTimer.isPaused()) {
         this.brightTimer.pause();
      }

      this.paused = true;
   },

   unpause: function() {
      if (this.dimTimer.isPaused()) {
         this.dimTimer.unpause();
      }

      if (this.brightTimer.isPaused()) {
         this.brightTimer.unpause();
      }

      this.paused = false;
   },
   
   startDimming: function (sprite) {
      this.dimTimer.start();
   },
      
   dim: function (sprite) {
      elapsedTime = this.dimTimer.getElapsedTime();  
      sprite.opacity = 1 - ((1 - this.opacityThreshold) *
                            (parseFloat(elapsedTime) / this.time));
   },

   finishDimming: function (sprite) {
      var self = this;
      this.dimTimer.stop();
      setTimeout( function (e) {
         self.brightTimer.start();
      }, 100);
   },
      
   isBrightening: function () {
      return this.brightTimer.isRunning();
   },
      
   isDimming: function () {
      return this.dimTimer.isRunning();
   },

   brighten: function (sprite) {
      elapsedTime = this.brightTimer.getElapsedTime();  
      sprite.opacity += (1 - this.opacityThreshold) *
                         parseFloat(elapsedTime) / this.time;
   },

   finishBrightening: function (sprite) {
      var self = this;
      this.brightTimer.stop();
      setTimeout( function (e) {
         self.dimTimer.start();
      }, 100);
   },
      
   execute: function(sprite, time, fps) {
      var elapsedTime;

     
      if (!this.isDimming() && !this.isBrightening()) {
         this.startDimming(sprite);
         return;
      }

      if(this.isDimming()) {              
         if(!this.dimTimer.isExpired()) {     
            this.dim(sprite);
         }
         else {                           
            this.finishDimming(sprite);
         }
      }
      else if(this.isBrightening()) {      
         if(!this.brightTimer.isExpired()) {  
            this.brighten(sprite);
         }
         else {                            
            this.finishBrightening(sprite);
         }
      }
   }
};
