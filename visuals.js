const bc = new BroadcastChannel("test_channel");
const DELAY = 10;

let radius = 50;
let timer = DELAY;
let effect_on = false;
let ellipses = [];

function setup() {
    createCanvas(800, 600);
    noFill();
    for (let i = 0; i < 8; i++ ) {
        ellipses[i] = {
            x: radius + i * radius * 2,
            y: radius + i * 500 / 7,
            w: radius * 2,
            h: radius * 2,
            dir: 1
        };
    }
}

function draw() {
    background(0);

    if (effect_on) {
        fill(0, 255, 255);
    } else {
        fill(255, 0, 255);
    }
    for (let i = 0; i < 8; i++ ) {
        ellipses[i].y += ellipses[i].dir * 5;
        if (ellipses[i].y < radius || ellipses[i].y > height - radius) {
            ellipses[i].dir *= -1;
        }
        ellipse(ellipses[i].x, ellipses[i].y, ellipses[i].w, ellipses[i].h);
    }

    if (effect_on) {
        if (timer > 0) {
            timer--;
        } else {
            effect_on = false;
            timer = DELAY;
        }
    }
}

bc.onmessage = (event) => {
    // receiving pulses
    console.log(event.data);
    effect_on = true;
};