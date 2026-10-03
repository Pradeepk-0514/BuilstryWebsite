import React, { useEffect, useRef } from "react";
import "./CursorCubeTrail.css";


const COLORS = {
  steelNavy: "#243447",
  midnight: "#141D26",
  magenta: "#C51F5D",
};



const CELL_SIZE = 30;

// Distance cursor must travel before another
// structure is generated.
const MOVE_THRESHOLD = 55;

// How long an old structure remains.
const LIFE_TIME = 1050;

// Maximum number of structures simultaneously visible.
const MAX_STRUCTURES = 8;


const PATTERNS = [
  [
    [0, 0],
    [1, 0],
    [2, 0],

    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],

    [-1, 2],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ],

  [
    [0, 0],
    [1, 0],
    [2, 0],

    [-1, 1],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],

    [0, 2],
    [1, 2],
    [2, 2],
  ],

  [
    [1, 0],
    [2, 0],

    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],

    [-1, 2],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ],

  [
    [0, 0],
    [1, 0],
    [2, 0],

    [0, 1],
    [1, 1],
    [2, 1],

    [-1, 2],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ],
];


export default function CursorCubeTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches;

    if (reduceMotion || coarsePointer) {
      return undefined;
    }

    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return undefined;
    }

    /*
    -----------------------------------------------------
    STATE
    -----------------------------------------------------
    */

    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,

      lastX: window.innerWidth / 2,
      lastY: window.innerHeight / 2,

      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,

      active: false,

      initialized: false,
    };

    const structures = [];

    let animationFrame = null;

    /*
    -----------------------------------------------------
    CANVAS SIZE
    -----------------------------------------------------
    */

    let width = window.innerWidth;
    let height = window.innerHeight;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();


    const snapToGrid = (value) => {
      return Math.floor(value / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
    };

  

    const createStructure = (cursorX, cursorY) => {
      const gridX = snapToGrid(cursorX);

      const gridY = snapToGrid(cursorY);

    

      const gridColumn = Math.floor(cursorX / CELL_SIZE);

      const gridRow = Math.floor(cursorY / CELL_SIZE);

      const patternIndex =
        Math.abs(gridColumn * 7 + gridRow * 13) % PATTERNS.length;

      const pattern = PATTERNS[patternIndex];

     

      const cells = pattern.map(([offsetX, offsetY], index) => {
        let color = COLORS.steelNavy;

       

        if (index === 0 || index === Math.floor(pattern.length / 2)) {
          color = COLORS.magenta;
        }

    

        if (index % 5 === 0 && index !== 0) {
          color = COLORS.midnight;
        }

        return {
          x: gridX + offsetX * CELL_SIZE,

          y: gridY + offsetY * CELL_SIZE,

          color,


          opacity: index === 0 ? 0.20 : index % 4 === 0 ? 0.10 : 0.09,
        };
      });

      return {
        cells,

        createdAt: performance.now(),


        lifetime: LIFE_TIME,
      };
    };

    const addStructure = () => {
      if (!mouse.active) {
        return;
      }

      const dx = mouse.targetX - mouse.lastX;

      const dy = mouse.targetY - mouse.lastY;

      const distance = Math.sqrt(dx * dx + dy * dy);


      if (mouse.initialized && distance < MOVE_THRESHOLD) {
        return;
      }

      const structure = createStructure(mouse.targetX, mouse.targetY);

      structures.push(structure);

      

      mouse.lastX = mouse.targetX;

      mouse.lastY = mouse.targetY;

      mouse.initialized = true;

     

      while (structures.length > MAX_STRUCTURES) {
        structures.shift();
      }
    };

   

    const drawCell = (cell, opacity) => {
      const size = CELL_SIZE - 1;

      const x = cell.x - CELL_SIZE / 2;

      const y = cell.y - CELL_SIZE / 2;

      ctx.globalAlpha = opacity;

      ctx.fillStyle = cell.color;

      ctx.fillRect(x, y, size, size);

    
      ctx.globalAlpha = opacity * 0.35;

      ctx.strokeStyle = cell.color;

      ctx.lineWidth = 0.8;

      ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
    };



    const drawStructure = (structure, now) => {
      const age = now - structure.createdAt;

      const progress = age / structure.lifetime;

      if (progress >= 1) {
        return false;
      }


      let fadeIn = 1;

      if (progress < 0.08) {
        fadeIn = progress / 0.08;
      }


      let fadeOut = 1;

      if (progress > 0.48) {
        fadeOut = 1 - (progress - 0.48) / 0.52;
      }

      const masterOpacity = Math.max(0, fadeIn * fadeOut);

      structure.cells.forEach((cell) => {
        drawCell(cell, cell.opacity * masterOpacity);
      });

      return true;
    };


    const handlePointerMove = (event) => {
      mouse.targetX = event.clientX;

      mouse.targetY = event.clientY;

      mouse.active = true;

      addStructure();
      startRender();
    };

 

    const handlePointerLeave = () => {
      mouse.active = false;
    };


        const render = (now) => {
      if (document.hidden) {
        animationFrame = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      
      for (let i = structures.length - 1; i >= 0; i--) {
        const alive = drawStructure(structures[i], now);

        if (!alive) {
          structures.splice(i, 1);
        }
      }


            if (structures.length > 0 || mouse.active) {
        animationFrame = requestAnimationFrame(render);
      } else {
        animationFrame = null;
      }
    };

    const startRender = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    window.addEventListener("pointerleave", handlePointerLeave);

    window.addEventListener("resize", resizeCanvas);


    animationFrame = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      if (!document.hidden) startRender();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerleave", handlePointerLeave);

      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      structures.length = 0;
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="cursor-cube-trail" aria-hidden="true" />
  );
}
