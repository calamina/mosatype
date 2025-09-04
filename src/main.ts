import p5 from "p5";

let render = true;

// main inputs
const input: HTMLInputElement | null = document.querySelector("#input");
const buttonMagic: HTMLButtonElement | null = document.querySelector(".magic-button");
const buttonSettings: HTMLButtonElement | null = document.querySelector(".settings-button");
// color inputs
const hueInput: HTMLInputElement | null = document.querySelector("#hue");
const lightInput: HTMLInputElement | null = document.querySelector("#light");
const chromaInput: HTMLInputElement | null = document.querySelector("#chroma");
// grid inputs
const columnInput: HTMLInputElement | null = document.querySelector("#columns");
const rowInput: HTMLInputElement | null = document.querySelector("#rows");
// numbers inputs
const sizeInput: HTMLInputElement | null = document.querySelector("#size");
const quantityInput: HTMLInputElement | null = document.querySelector("#quantity");

const data = {
  fontsize: 16,
  quantity: window.innerWidth / 4,
  grid: {
    cols: 40,
    rows: 25
  },
  colors: {
    light: 65,
    hue: 8,
    chroma: 288,
  }
}

buttonSettings?.addEventListener("click", () => {
  const cols = getComputedStyle(document.body).gridTemplateColumns;
  document.body.style.gridTemplateColumns = cols.startsWith("0px") ? "15rem auto" : "0 auto"
})

const updateInputs = () => {
  hueInput!.value = data.colors.hue.toString()
  lightInput!.value = data.colors.light.toString()
  chromaInput!.value = data.colors.chroma.toString()
  columnInput!.value = data.grid.cols.toString()
  rowInput!.value = data.grid.rows.toString()
  sizeInput!.value = data.fontsize.toString()
  quantityInput!.value = Math.floor(20 - window.innerWidth / data.quantity).toString()
}

const script = (p5: p5) => {
  p5.setup = async () => {
    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("app");
    p5.textFont(await p5.loadFont("./apercuMono.ttf"));
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  p5.draw = () => {
    if (!render) return
    p5.clear()
    p5.textSize(data.fontsize);
    const accent = getComputedStyle(document.body).getPropertyValue("--color-accent");
    const textcolor: p5.Color = p5.color(accent);
    const rows = window.innerHeight / data.grid.rows;
    const cols = window.innerWidth / data.grid.cols;
    for (let i = 0; i <= data.quantity; i++) {
      const row = p5.round(p5.random(data.grid.rows)) * rows;
      const col = p5.round(p5.random(data.grid.cols)) * cols;
      const textalpha = p5.random(255);
      textcolor.setAlpha(textalpha);
      p5.fill(textcolor);
      p5.text(input?.value ?? "hello", col, row);
    }
    render = false
  };

  p5.windowResized = () => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
    render = true
  };

  input?.addEventListener("input", () => render = true)

  // Color events
  hueInput?.addEventListener("input", () => {
    data.colors.hue = Number(hueInput.value)
    colorize()
  })
  lightInput?.addEventListener("input", () => {
    data.colors.light = Number(lightInput.value)
    colorize()
  })
  chromaInput?.addEventListener("input", () => {
    data.colors.chroma = Number(chromaInput.value)
    colorize()
  })

  // Grid events
  columnInput?.addEventListener("input", () => {
    data.grid.cols = Number(columnInput.value)
    render = true
    updateInputs()
  })
  rowInput?.addEventListener("input", () => {
    data.grid.rows = Number(rowInput.value)
    render = true
    updateInputs()
  })

  // Numbers events
  sizeInput?.addEventListener("input", () => {
    data.fontsize = Number(sizeInput.value)
    render = true
    updateInputs()
  })
  quantityInput?.addEventListener("input", () => {
    data.quantity = window.innerWidth / (20 - Number(quantityInput.value))
    render = true
    updateInputs()
  })

  buttonMagic?.addEventListener("click", () => randomize())

  const randomize = () => {
    data.fontsize = p5.floor(p5.random(10, 40));
    data.grid.cols = p5.floor(p5.random(25, 60));
    data.grid.rows = p5.floor(data.grid.cols * 0.75);
    data.quantity = window.innerWidth / p5.floor(p5.random(1, 10));

    data.colors.light = p5.floor(p5.random(0, 100))
    data.colors.hue = p5.floor(p5.random(0, 360))
    data.colors.chroma = p5.floor(p5.random(6, 9))

    colorize()
  }

  const colorize = () => {
    const body: HTMLElement | null = document.querySelector("body")
    const accent = `oklch(${data.colors.light}% 0.0${data.colors.chroma} ${data.colors.hue})`
    const backLight = data.colors.light > 50 ? data.colors.light - 40 : data.colors.light + 40
    const background = `oklch(${backLight}% 0.0${data.colors.chroma - 4} ${data.colors.hue})`

    body?.style.setProperty("--color-accent", accent)
    body?.style.setProperty("--color-background", background)
    body?.style.setProperty("--color-background-dim", background.slice(0, -1) + " / 30%)")

    render = true
    updateInputs()
  }

  // setInterval(() => {
  //   randomize()
  // }, 1800);
  randomize()

}

window.onload = () => new p5(script)