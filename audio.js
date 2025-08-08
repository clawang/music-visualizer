const THROTTLE = 10;
const FREQUENCY_COUNT = 8;
const bc = new BroadcastChannel("test_channel");

let mic, fft;
let line_height;
let selected_freq;
let timer_current = THROTTLE;

function setup() {
    createCanvas(710, 600);
    noFill();

    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
    line_height = height / 2;
    selected_freq = 0;
}

function draw() {
    background(0);

    let amps = fft.analyze();
    let spectrum = process(amps);

    noStroke();

    
    for (let i = 0; i < spectrum.length; i++) {
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, height, 0);
        if (i === selected_freq) {
            fill(255, 255, 0);
        } else {
            fill(255, 0, 255);
        }
        rect(x, height, width / spectrum.length, h)
    }

    const shift = 4;
    if (keyIsPressed) {
        if (keyCode === UP_ARROW && line_height > 0) {
            line_height -= shift;
        } else if (keyCode === DOWN_ARROW && line_height < height) {
            line_height += shift;
        }
    }

    fill(0, 255, 255);
    rect(0, line_height, width, 2);

    if (line_height > map(spectrum[selected_freq], 0, 255, height, 0)) {
        sendSignal();
    }
}

function process(spectrum) {
    const amps = new Array(FREQUENCY_COUNT);
    for (let group = 0; group < FREQUENCY_COUNT; group++) {
        let sum = 0;
        for (let i = 0; i < spectrum.length / FREQUENCY_COUNT; i++) {
            sum += spectrum[i + group * 1024 / FREQUENCY_COUNT];
        }
        amps[group] = sum / (1024 / FREQUENCY_COUNT);
    }
    return amps;
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        selected_freq = (selected_freq - 1) % FREQUENCY_COUNT;
    } else if (keyCode === RIGHT_ARROW) {
        selected_freq = (selected_freq + 1) % FREQUENCY_COUNT;
    }
}

function sendSignal() {
    if (timer_current > 0) {
        timer_current--;
    } else {
        bc.postMessage("pulse");
        console.log('pulse');
        timer_current = THROTTLE;
    }
}