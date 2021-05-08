
import blessed from "blessed"
import fs from "fs"
import path from "path"
import { Global } from '../Global/Global';

const pkgJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"))
const versionNumber = "v" + pkgJson.version;


export function getNav() {
  const masterRaw = "MASTER"
  const masterTitle = `{bold}{red-fg}${masterRaw}{/bold}{/red-fg}`;
  const versionColor = `{cyan-fg}${versionNumber}{/cyan-fg}`;
  const screen = Global.screen;

  const box = blessed.box({
    parent: screen,
    content: `${masterTitle}{|}${versionColor}`,
    tags: true
  })

  screen.addListener("resize", () => {
    box.render();
  })

}