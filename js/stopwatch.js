
Stopwatch = function ()  {
   this.startTime = 0;
   this.running = false;
   this.elapsed = undefined;

   this.paused = false;
   this.startPause = 0;
   this.totalPausedTime = 0;
};



Stopwatch.prototype = {
   start: function () {
      this.startTime = +new Date();
      this.running = true;
      this.totalPausedTime = 0;
      this.startPause = 0;
   },

   stop: function () {
      if (this.paused) {
         this.unpause();
      }
      
      this.elapsed = (+new Date()) - this.startTime -
                                     this.totalPausedTime;
      this.running = false;
   },

   pause: function () {
      if (this.paused) {
         return;
      }

      this.startPause = +new Date(); 
      this.paused = true;
   },

   unpause: function () {
      if (!this.paused) {
         return;
      }

      this.totalPausedTime += (+new Date()) - this.startPause; 
      this.startPause = 0;
      this.paused = false;
   },

   isPaused: function () {
      return this.paused;
   },
   
   getElapsedTime: function () {
      if (this.running) {
         return (+new Date()) - this.startTime - this.totalPausedTime;
      }
      else {
        return this.elapsed;
      }
   },

   isPaused: function() {
      return this.paused;
   },

   isRunning: function() {
      return this.running;
   },

   reset: function() {
     this.elapsed = 0;
     this.startTime = +new Date();
     this.running = false;
     this.totalPausedTime = 0;
     this.startPause = 0;
   }
};
