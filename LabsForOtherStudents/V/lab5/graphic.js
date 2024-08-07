document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('graphCanvas');
  const ctx = canvas.getContext('2d');

  const scaleButtons = document.querySelectorAll('.scale-button');
  const translateButtons = document.querySelectorAll('.translate-button');

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const step = 25 * scale;

    // Рисуем координатную сетку
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.8)';
    ctx.lineWidth = 0.2;
    ctx.setLineDash([5, 5]);
    for (let y = centerY % step; y < canvas.height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }

    for (let x = centerX % step; x < canvas.width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }

    ctx.stroke();
    ctx.setLineDash([]);

    // Рисуем оси координат
    ctx.beginPath();
    ctx.lineWidth = 1.25;

    ctx.strokeStyle = 'black';
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Подписываем деления осей x и y
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';


    // Переменные для позиций подписей осей x и y
    const labelXPosition = centerX;
    const labelYPosition = centerY;

    for (let x = -Math.floor(centerX / step); x <= Math.ceil(centerX / step);
         x++) {
      const xPos = labelXPosition + x * step;
      ctx.fillText(x.toString(), xPos, labelYPosition + 10);
    }

    for (let y = -Math.floor(centerY / step); y <= Math.ceil(centerY / step);
         y++) {
      const yPos = labelYPosition - y * step;
      ctx.fillText(y.toString(), labelXPosition - 10, yPos);
    }

    ctx.font = 'bold 12px Arial';
    ctx.fillText('X', canvas.width - 10, labelYPosition + 10);
    ctx.fillText('Y', labelXPosition - 10, 10);
    ctx.font = '12px Arial';

    drawArrowhead(
        ctx, canvas.width - 10, labelYPosition, canvas.width,
        labelYPosition);  // Стрелка по оси X
    drawArrowhead(
        ctx, labelXPosition, 5, labelXPosition, 0);  // Стрелка по оси Y

    ctx.lineWidth = 1;
    ctx.stroke();

    // Рисуем график sin^2(x)
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    const stepX = 0.1 / scale;
    const startX = (-centerX + translateX) / (25 * scale);
    const endX = (canvas.width - centerX + translateX) / (25 * scale);

    for (let x = startX; x <= endX; x += stepX) {
      const plotX = x * 25 * scale - translateX;
      const plotY = (x - 2 * Math.exp(x)) * 25 * scale - translateY;
      const canvasX = centerX + plotX;
      const canvasY = centerY - plotY;

      if (x === startX) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }

    ctx.stroke();
  }

  function drawArrowhead(ctx, fromX, fromY, toX, toY) {
    const headLength = 10;  // длина стрелочки

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    const angle = Math.atan2(toY - fromY, toX - fromX);

    // Рисуем стрелку
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
        toX - headLength * Math.cos(angle - Math.PI / 6),
        toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(
        toX - headLength * Math.cos(angle + Math.PI / 6),
        toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }

  function handleScale(factor) {
    scale *= factor;
    drawGraph();
  }

  function handleScale(factor) {
    scale *= factor;
    drawGraph();
  }

  function handleTranslate(direction, amount) {
    const stepSize = 20 / scale;
    const shiftAmount = stepSize * amount * scale;  // Учитываем масштаб

    if (direction === 'left') {
      translateX += shiftAmount;
    } else if (direction === 'right') {
      translateX -= shiftAmount;
    } else if (direction === 'up') {
      translateY -= shiftAmount;
    } else if (direction === 'down') {
      translateY += shiftAmount;
    }

    drawGraph();
  }


  scaleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const factor = parseFloat(button.dataset.scale);
      handleScale(factor);
    });
  });

  translateButtons.forEach(button => {
    button.addEventListener('click', () => {
      const direction = button.dataset.direction;
      const amount = parseFloat(button.dataset.amount);
      handleTranslate(direction, amount);
    });
  });

  drawGraph();
});
