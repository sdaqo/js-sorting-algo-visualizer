function startTimer() {
  return performance.now();
}

function endTimer(startTime) {
  const endTime = performance.now();
  var timeDiff = endTime - startTime;
  timeDiff /= 1000;
  var seconds = Math.round(timeDiff);
  return seconds;
}

var isStopped = false;

class sortingAlgos {
  constructor() {
    this.canvas = document.getElementById("main");
    this.canvas.width = window.innerWidth * 0.9;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineWidth = 6;
    this.lw = this.ctx.lineWidth;
    this.space = 1;
    this.ctx.strokeStyle = "white";

    this.timeout = 1;

    this.status = document.getElementById("status");
  }

  async run(algo, rand) {
    let array;
    if (rand) {
      array = this.makeRandomArray();
      this.drawList(array);
    } else {
      array = this.makeOrderdArray();
      this.drawList(array);
      this.status.innerHTML = "Shuffling Array...";
      array = await this.shuffelArray(array);
      array = await this.shuffelArray(array);
      array = await this.shuffelArray(array);
    }

    const startTime = startTimer();
    switch (algo) {
      case "bubblesort":
        this.status.innerHTML = "Using Bubblesort...";
        await this.bubbleSort(array);
        break;
      case "pigeonhole":
        this.status.innerHTML = "Using Pigeonhole...";
        await this.pigeonholeSort(array);
        break;
      case "gravitysort":
        this.status.innerHTML = "Using Gravitysort...";
        await this.gravitySort(array);
        break;
      default:
        return 0;
    }
    const elapsed = endTimer(startTime);
    this.status.innerHTML = `Took ${elapsed} seconds`;
  }

  drawList(list) {
    const { space, height, ctx } = this;
    let offset = this.lw;
    list.forEach((num) => {
      ctx.beginPath();
      ctx.moveTo(offset, height);
      ctx.lineTo(offset, height - num);
      ctx.stroke();
      offset += this.lw + space;
    });
  }

  drawLine(index, number, color) {
    const { space, ctx, height } = this;
    if (isStopped) {
      return;
    }
    let offset = (space + this.lw) * index + this.lw;
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset, height);
    ctx.lineWidth = this.lw;

    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(offset, height);
    ctx.lineTo(offset, height - number);
    ctx.lineWidth = this.lw;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  async endDraw(list) {
    for (let i = 0; i < list.length; i++) {
      if (isStopped) {
        break;
      }
      this.drawLine(i, list[i], "red");
      await new Promise((r) => setTimeout(r, this.timeout));
      this.drawLine(i, list[i], "green");
    }
  }

  makeOrderdArray() {
    const len = parseInt(this.width / (this.lw + this.space));
    let num = 1;

    return Array.from({ length: len }, () => (num = num + this.height / len));
  }

  makeRandomArray() {
    return Array.from(
      { length: parseInt(this.width / (this.lw + this.space)) },
      () => Math.floor(Math.random() * this.height)
    );
  }

  async shuffelArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      if (isStopped) {
        break;
      }
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      this.drawLine(i, arr[j], "red");
      arr[i] = arr[j];
      this.drawLine(j, temp, "red");
      arr[j] = temp;
      await new Promise((r) => setTimeout(r, this.timeout));
      this.drawLine(i, arr[j], "white");
      this.drawLine(j, temp, "white");
    }
    return arr;
  }

  findMaxMin(arr, length) {
    let min = arr[0];
    let max = arr[0];

    for (let a = 0; a < length; a++) {
      if (arr[a] > max) max = arr[a];
      if (arr[a] < min) min = arr[a];
    }

    return { min: min, max: max, range: max - min + 1 };
  }

  async bubbleSort(list) {
    for (let i = 0; i < list.length; i++) {
      if (isStopped) {
        break;
      }
      for (let j = 0; j < list.length - 1; j++) {
        if (isStopped) {
          break;
        }
        if (list[j] > list[j + 1]) {
          this.drawLine(j, list[j], "red");
          this.drawLine(j + 1, list[j + 1], "red");
          list.splice(j, 0, ...list.splice(j + 1, 1));
          await new Promise((r) => setTimeout(r, this.timeout));
          this.drawLine(j, list[j], "white");
          this.drawLine(j + 1, list[j + 1], "white");
        }
      }
    }
    this.endDraw(list);
  }

  async pigeonholeSort(list) {
    const len = list.length;
    const minmax = this.findMaxMin(list, len);
    let holes = [];

    for (let i = 0; i < minmax.range; i++) holes[i] = 0;

    for (let i = 0; i < len; i++) {
      if (isStopped) {
        break;
      }
      this.drawLine(i, list[i], "red");
      holes[parseInt(list[i] - minmax.min)]++; // parsInt() for decimal numbers
      await new Promise((r) => setTimeout(r, this.timeout));
      this.drawLine(i, list[i], "white");
    }

    let index = 0;

    for (let j = 0; j < minmax.range; j++) {
      if (isStopped) {
        break;
      }

      while (holes[j] > 0) {
        holes[j]--;
        if (isStopped) {
          break;
        }
        list[index] = j + minmax.min;
        this.drawLine(index, list[index], "red");
        await new Promise((r) => setTimeout(r, this.timeout));
        this.drawLine(index, list[index], "white");

        index++;
      }
    }

    this.endDraw(list);
  }

  async gravitySort(arr) {
    let len = arr.length;
    const minmax = this.findMaxMin(arr, len);
    let res = [];
    let transposed = [];

    for (let i = 0; i < minmax.max; i++) transposed[i] = 0;

    for (let i = 0; i < arr.length; i++) {
      this.drawLine(i, arr[i], "red");
      for (let j = 0; j < arr[i]; j++) {
        transposed[j] += 1;
      }
      await new Promise((r) => setTimeout(r, this.timeout));
      this.drawLine(i, arr[i], "white");
    }

    for (let i = 0; i < len; i++) {
      let total = 0;
      for (let j = 0; j < transposed.length; j++) {
        if (transposed[j] > 0) {
          total += 1;
        }
      }
      let new_len = res.push(total);
      this.drawLine(new_len - 1, total, "red");
      await new Promise((r) => setTimeout(r, this.timeout));
      this.drawLine(new_len - 1, total, "white");

      for (let f = 0; f < transposed.length; f++) {
        transposed[f] -= 1;
      }
    }
  }
}

function switchBtnState(isDisabled) {
  var btn = document.getElementById("submit-btn");
  btn.disabled = isDisabled;
}

document
  .getElementById("form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    isStopped = false;

    let algoClass = new sortingAlgos();

    switchBtnState(true);
    let algo;
    let rand = false;

    if (event.target[0].checked) {
      algo = "bubblesort";
    } else if (event.target[1].checked) {
      algo = "pigeonhole";
    } else if (event.target[2].checked) {
      algo = "gravitysort";
    }

    if (event.target[3].checked) {
      rand = true;
    }

    await algoClass.run(algo, rand);

    switchBtnState(false);
  });

function resetApp() {
  isStopped = true;
  this.canvas = document.getElementById("main");
  this.ctx = this.canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
