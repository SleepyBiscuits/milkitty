var waveCat= new TimelineMax({ease: Bounce.easeOut})
    .from('.wave-bg-top', 3, {x:"-10%", repeat:-1., yoyo:true},0) /*wave 1*/
    .from('.wave-bg-top', 1, { y: +5, repeat:-1, yoyo:true},0)
    /*wave 2*/
    .from('.wave-bg-bot', 3, {x:"-5%", repeat:-1., yoyo:true},0) /*bot wave 1*/
    .from('.wave-bg-bot', 1, { y: -4, repeat:-1, yoyo:true},0);
    /*.from('.wave-mid', 1.5, {y:+10, repeat:-1, yoyo:true},0.1)*/

gsap.from('.wave-boba', {duration:2, y:'60%', ease:'bounce'});

var spiral = document.getElementsByClassName('wave-boba-spiral');
var bobas = document.getElementsByClassName('wave-boba');
var bobabounce = new TimelineMax()
    .staggerFromTo(spiral, .6, {y:0},{y:-5, ease: Sine.easeInOut, repeat: -1, yoyo: true}, .4) 
    .staggerFromTo(bobas, .6, {y:0},{y:-5, ease: Sine.easeInOut, repeat: -1, yoyo: true}, .4); 
/* wave cat 
let cat = document.getElementByClass("wave-cat");
let catAnim;
catAnim = lottie.loadAnimation({
    container: cat,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'https://lottie.host/c3bc85c6-b1c5-4c0d-a0c3-0d20811108a2/6UxonWcTiO.json'
  });*/



// Footer waves inspired by @concept-image
let fwave = document.getElementById("fwave");
let context = fwave.getContext("2d");
let resolution = window.devicePixelRatio || 1;

let waves = [];
let resized = false;

let vw, vh;
resizeFooter();

let wave1 = createWave(context, {
  amplitude: 100, // was 50 
  duration: 4,
  fillStyle: "#7063bf",
  frequency: 2.5,
  width: vw,
  height: document.getElementById("fwave").parentNode.parentElement.clientWidth,
  segments: 100,
  waveHeight: vh * 0.25 // was 0.25
});

let wave2 = createWave(context, {
  amplitude: 200, // was 100
  duration: 2,
  fillStyle: "#7063bf",
  frequency: 1.5,
  width: vw,
  height: document.getElementById("fwave").parentNode.parentElement.clientWidth,
  segments: 100,
  waveHeight: vh * 0.25 // was 0.25
});

waves.push(wave1);

gsap.to(waves, {
  duration: 10,
  waveHeight: vh / 4.5, // was 3.5
  ease: "sine.inOut",
  repeat: -1,
  repeatDelay: 1,
  yoyo: true
});

gsap.to(wave1, {
  duration: 6,
  amplitude: 50, // was 10 
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});

gsap.to(wave2, {
  duration: 7,
  amplitude: 100,  //was 25
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});

window.addEventListener("resize", () => {
  resized = true;
});

gsap.ticker.add(update);

function update() {
  
  let len = waves.length;
  
  if (resized) {
    
    resizeFooter();
    
    for (let i = 0; i < len; i++) {
      waves[i].resize(vw, vh);
    }
    
    resized = false;
  }
  
  context.clearRect(0, 0, vw, vh);  
  context.globalCompositeOperation = "soft-light";
  
  for (let i = 0; i < len; i++) {
    waves[i].draw();
  }
}

function createWave(context, options) {
  
  options = options || {};
  
  // API
  let wave = {
    
    // Properties
    amplitude: options.amplitude || 200,
    context: context,
    curviness: options.curviness || 0.75,
    duration: options.duration || 2,
    fillStyle: options.fillStyle || "rgba(33,150,243,1)",
    frequency: options.frequency || 4,
    height: options.height || 600,
    points: [],
    segments: options.segments || 100,
    tweens: [],
    waveHeight: options.waveHeight || 300,
    width: options.width || 800,
    x: options.x || 0,
    y: options.y || 0,
    
    // Methods
    init: init,
    resize: resize,
    draw: draw,
    kill: kill
  };
  
  init();
    
  function kill() {
    
    let tweens = wave.tweens;
    let len = tweens.length;
    
    for (let i = 0; i < len; i++) {
      tweens[i].kill();
    }
    
    tweens.length = 0;
    wave.points.length = 0;
  }
  
  function init() {
    
    kill();
    
    let segments = wave.segments;
    let interval = wave.width / segments;
    
    for (let i = 0; i <= segments; i++) {
      
      let norm = i / segments;
      let point = {
        x: wave.x + i * interval,
        y: 1
      };
      
      let tween = gsap.to(point, {
        duration: wave.duration,
        y: -1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }).progress(norm * wave.frequency)
      
      wave.tweens.push(tween);
      wave.points.push(point);
    }    
  }
  
  function draw() {
    
    let points = wave.points;
    let len = points.length;
    
    let startY = wave.waveHeight;
    let height = wave.amplitude / 2;
    
    context.beginPath();    
    context.moveTo(points[0].x, startY + points[0].y * height);
    
    for (let i = 1; i < len; i++) {
      
      let point = points[i];
      context.lineTo(point.x, startY + point.y * height);
    }
    
    context.lineTo(wave.x + wave.width, wave.y + wave.height);
    context.lineTo(wave.x, wave.y + wave.height);
    context.closePath();
    context.fillStyle = wave.fillStyle;
    context.fill();
  }
  
  function resize(width, height) {
    
    wave.width = width;
    wave.height = height;
    
    let points = wave.points;
    let len = points.length;
    let interval = wave.width / wave.segments;
    
    for (let i = 0; i < len; i++) {
      
      let point = points[i];
      point.x = wave.x + i * interval;
    }
  }
  
  return wave;
}

function resizeFooter() {
  
  vw = window.innerWidth;
  vh = window.innerHeight;
    
  fwave.width  = vw * resolution;
  fwave.height = vh * resolution;
  
  fwave.style.width  = vw + "px";
  fwave.style.height = vh + "px";
  
  context.scale(resolution, resolution);
}

// Scroll to top button 
$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});

$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});


  
  

