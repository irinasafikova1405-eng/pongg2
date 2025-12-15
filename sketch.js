let w = 600;
let h = 600;
let state = 'pause'; // pause vs game
let bgColor = 140;
let human, ball, pc;
let tics = 0;
let humanScore = 0;
let pcScore = 0;

class Paddle {
  constructor(player) {
    // human vs pc
    if (player == 'human') {
      this.player = 'human';
      this.w = 10;
      this.h = 100;
      this.x = 0;
      this.y = h / 2 - this.h / 2;
      this.color = 'pink';
    } else {
      this.player = 'pc';
      this.w = 10;
      this.h = 100;
      this.x = w - this.w;
      this.y = h / 2 - this.h / 2;
      this.color = 'teal';
    }
  }

  show() {
    fill(this.color);
    rect(this.x, this.y, this.w, this.h);
  }

  move() {
    if (this.player == 'human') {
      if (keyIsPressed == true) {
        if (keyCode == DOWN_ARROW) {
          if (this.y + this.h < h) {
            this.y += 10;
          }
        }
        if (keyCode == UP_ARROW) {
          if (this.y > 0) {
            this.y -= 10;
          }
        }
      }
    } else {
      // AI для PC: следит за мячом
      if (this.y + this.h / 2 > ball.y) {
        this.y -= 5;
      } else {
        this.y += 5;
      }
      // Ограничение движения PC в пределах поля
      this.y = constrain(this.y, 0, h - this.h);
    }
  }
}

class Ball {
  constructor() {
    this.d = 20; // диаметр мяча
    this.reset();
  }

  reset() {
    this.x = w / 2;
    this.y = h / 2;
    this.color = 'red';
    // Случайный начальный угол
    let angle = random(-PI / 4, PI / 4);
    this.speed = 5;
    this.speedX = this.speed * cos(angle);
    this.speedY = this.speed * sin(angle);
    // Направление к игроку, который только что пропустил
    if (random() > 0.5) this.speedX *= -1;
  }

  show() {
    fill(this.color);
    ellipse(this.x, this.y, this.d);
  }

  move() {
    // Движение
    this.x += this.speedX;
    this.y += this.speedY;

    // Отскок от верхней и нижней стен
    if (this.y - this.d / 2 <= 0 || this.y + this.d / 2 >= h) {
      this.speedY *= -1;
      // Звук отскока (если будет звук)
    }

    // Столкновение с ракеткой человека (левая сторона)
    if (
      this.x - this.d / 2 <= human.x + human.w &&
      this.x - this.d / 2 >= human.x &&
      this.y > human.y - this.d / 2 &&
      this.y < human.y + human.h + this.d / 2
    ) {
      this.speedX = abs(this.speedX); // Движение вправо
      this.color = [0, 255, 0]; // Зелёный при ударе
      // Небольшое изменение угла в зависимости от места удара
      let diff = this.y - (human.y + human.h / 2);
      this.speedY = diff * 0.2;
    }

    // Столкновение с ракеткой ПК (правая сторона)
    if (
      this.x + this.d / 2 >= pc.x &&
      this.x + this.d / 2 <= pc.x + pc.w &&
      this.y > pc.y - this.d / 2 &&
      this.y < pc.y + pc.h + this.d / 2
    ) {
      this.speedX = -abs(this.speedX); // Движение влево
      this.color = [0, 255, 0]; // Зелёный при ударе
      let diff = this.y - (pc.y + pc.h / 2);
      this.speedY = diff * 0.2;
    }

    // Проверка на гол (мяч ушёл за левую или правую границу)
    if (this.x - this.d / 2 < 0) {
      // Гол в ворота человека
      pcScore++;
      this.reset();
      state = 'pause';
    }
    if (this.x + this.d / 2 > w) {
      // Гол в ворота ПК
      humanScore++;
      this.reset();
      state = 'pause';
    }

    // Ограничение скорости по Y (чтобы не было слишком вертикально)
    this.speedY = constrain(this.speedY, -8, 8);
  }
}

function setup() {
  createCanvas(w, h);
  human = new Paddle('human');
  pc = new Paddle('pc');
  ball = new Ball();
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  tics++;
  background(bgColor);

  // Отрисовка счёта
  fill(255);
  text(humanScore, w / 4, 50);
  text(pcScore, (3 * w) / 4, 50);

  // Отрисовка разделительной линии
  stroke(255, 100);
  for (let y = 0; y < h; y += 20) {
    line(w / 2, y, w / 2, y + 10);
  }

  human.show();
  human.move();
  pc.show();
  if (tics == 6) {
    tics = 0;
    pc.move();
  }

  ball.show();
  if (state == 'game') {
    ball.move();
  } else {
    // В режиме паузы показываем текст
    fill(255);
    noStroke();
    text('PRESS SPACE TO START', w / 2, h / 2);
    textSize(16);
    text('Use UP/DOWN arrows to move', w / 2, h / 2 + 40);
    textSize(32);
  }
}

function keyPressed() {
  if (keyCode == 32) {
    // Пробел
    if (state == 'pause') {
      state = 'game';
    } else {
      state = 'pause';
    }
  }
}