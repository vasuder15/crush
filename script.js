let highestZ = 1;

    class Paper {
      constructor() {
        this.holdingPaper = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchMoveX = 0;
        this.touchMoveY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.prevTouchX = 0;
        this.prevTouchY = 0;
        this.velX = 0;
        this.velY = 0;
        this.rotation = Math.random() * 30 - 15;
        this.currentPaperX = 0;
        this.currentPaperY = 0;
        this.rotating = false;
      }

      init(paper) {
        // Helper function to debounce events for performance optimization
        const debounce = (func, wait) => {
          let timeout;
          return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
          };
        };

        const onMove = debounce((e) => {
          e.preventDefault();
          if (!this.rotating) {
            this.touchMoveX = e.touches[0].clientX;
            this.touchMoveY = e.touches[0].clientY;

            this.velX = this.touchMoveX - this.prevTouchX;
            this.velY = this.touchMoveY - this.prevTouchY;
          }

          const dirX = e.touches[0].clientX - this.touchStartX;
          const dirY = e.touches[0].clientY - this.touchStartY;
          const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
          const dirNormalizedX = dirX / dirLength;
          const dirNormalizedY = dirY / dirLength;

          const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
          let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;
          if (this.rotating) {
            this.rotation = degrees;
          }

          if (this.holdingPaper) {
            if (!this.rotating) {
              this.currentPaperX += this.velX;
              this.currentPaperY += this.velY;
            }
            this.prevTouchX = this.touchMoveX;
            this.prevTouchY = this.touchMoveY;

            paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
          }
        }, 16); // 16ms for smooth 60fps

        // Handle touch move
        paper.addEventListener('touchmove', onMove);

        // Handle touch start
        paper.addEventListener('touchstart', (e) => {
          if (this.holdingPaper) return;
          this.holdingPaper = true;

          paper.style.zIndex = highestZ;
          highestZ += 1;

          this.touchStartX = e.touches[0].clientX;
          this.touchStartY = e.touches[0].clientY;
          this.prevTouchX = this.touchStartX;
          this.prevTouchY = this.touchStartY;
        });

        // Handle touch end
        paper.addEventListener('touchend', () => {
          this.holdingPaper = false;
          this.rotating = false;
        });

        // For two-finger rotation on touch screens
        paper.addEventListener('gesturestart', (e) => {
          e.preventDefault();
          this.rotating = true;
        });

        paper.addEventListener('gestureend', () => {
          this.rotating = false;
        });
      }
    }

    // Initialize papers
    const papers = Array.from(document.querySelectorAll('.paper'));
    papers.forEach(paper => {
      const p = new Paper();
      p.init(paper);
    });