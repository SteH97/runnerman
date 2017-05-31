
CycleBehavior = function (interval, delay) {
   this.interval = interval || 0;  
   this.delay = delay || 0;
   this.lastAdvance = 0;
};

CycleBehavior.prototype = { 
   execute: function(sprite, time, fps) {
      if (this.lastAdvance === 0) {
         this.lastAdvance = time;
      }

      if (this.delay && sprite.artist.cellIndex === 0) {
         if (time - this.lastAdvance > this.delay) {
            sprite.artist.advance();
            this.lastAdvance = time;
         }
      }
      else if (time - this.lastAdvance > this.interval) {
         sprite.artist.advance();
         this.lastAdvance = time;
      }
   }
};
