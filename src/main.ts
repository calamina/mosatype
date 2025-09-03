import p5 from "p5";


const themes = [
  "base",
  "avocado",
  "coffee",
]
let index = 0




const script = (p5: p5) => {
  let font: p5.Font;
  let accent = getComputedStyle(document.body).getPropertyValue("--color-accent");
  const input: HTMLInputElement | null = document.querySelector("input");
  const button: HTMLButtonElement | null = document.querySelector("button");

  const fontsize = 16;
  let string: String = input?.value ?? "hello"

  p5.setup = async () => {
    font = await p5.loadFont("./src/apercuMono.ttf");
    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("app");
    p5.textFont(font);
    p5.textSize(fontsize);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.noLoop();
  };

  p5.draw = () => {
    const textcolor: p5.Color = p5.color(accent);
    const rows = window.innerHeight / 25;
    const cols = window.innerWidth / 40;
    for (let i = 0; i <= window.innerWidth / 4; i++) {
      const row = p5.round(p5.random(25)) * rows;
      const col = p5.round(p5.random(40)) * cols;
      const textalpha = p5.random(255);

      textcolor.setAlpha(textalpha);
      p5.fill(textcolor);
      p5.text(string, col, row);
    }
  };

  p5.windowResized = () => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  button?.addEventListener("click", () => {
    index = index >= (themes.length - 1) ? 0 : index + 1
    document.querySelector("html")?.setAttribute("data-selected-theme", themes[index])
    accent = getComputedStyle(document.body).getPropertyValue("--color-accent");
    p5.clear()
    p5.redraw()
  })

  input?.addEventListener("input", () => {
    string = input?.value || ""
    p5.clear()
    p5.redraw()
  })
}

window.onload = () => {
  new p5(script);
};