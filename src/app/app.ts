import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Drawer } from "./feature/daisy-page/Component/Drawer/Drawer";
import { FooterPage } from "./feature/daisy-page/Component/footer-page/footer-page";
import { BackToTop } from "./feature/share/componet/back-to-top/back-to-top";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Drawer, FooterPage, BackToTop],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('03-ui-componentes-estilos');
}
