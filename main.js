let nextRandom;
const ctx = document.getElementById('canvas').getContext('2d');
const uIntArr = new Uint32Array();

// TODO: support different output bits
function init() {
  document.forms.main.addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;

    if (!isFormValid(form)) {
      alert('Please provide 32bit unsigned int values');
      return;
    }
    const values = [
      Number(form.a.value),
      Number(form.c.value),
      Number(form.m.value),
      Number(form.seed.value)
    ]

    nextRandom = buildGenerator(...values);
    updateCurrentSetup(...values);
  });

  document.getElementById('draw-btn').addEventListener('click', () => {
    console.log(nextRandom());
    draw();
  })
}

function isFormValid(mainForm) {
  const isValid = [mainForm.a.value, mainForm.c.value, mainForm.m.value, mainForm.seed.value].every(val => {
    return isNumeric(val.trim()) && Number(val) < Math.pow(2, 32);
  });

  return isValid;
}

function isNumeric(string) {
  return /^\d+$/.test(string);
}

function updateCurrentSetup(a, c, m, seed) {
  const row = document.getElementById('current-setup');
  row.cells[0].innerHTML = a;
  row.cells[1].innerHTML = c;
  row.cells[2].innerHTML = m;
  row.cells[3].innerHTML = seed;
}

function draw() {
  let imgData = ctx.createImageData(1024, 1024);
  let random = nextRandom();
  let randomBinaryString = random.toString(2).padStart(32, '0');

  for (let i = 0; i < imgData.data.length; i += 4) {
    if (randomBinaryString[i % 32] === '0') {
      imgData.data[i+0] = 255;
      imgData.data[i+1] = 255;
      imgData.data[i+2] = 255;
      imgData.data[i+3] = 255;
    } else {
      imgData.data[i+0] = 0;
      imgData.data[i+1] = 0;
      imgData.data[i+2] = 0;
      imgData.data[i+3] = 0;
    }

    if (typeof randomBinaryString[i % 32 + 1] === 'undefined') {
      random = nextRandom();
      randomBinaryString = random.toString(2).padStart(32, '0');
    }
  }

  ctx.putImageData(imgData, 10, 10);
}

function buildGenerator(a, c, m, seed) {
  return function() {
    seed = (a * seed + c) % m;
    return seed;
  }
}

init();
