import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SignalBoxComponent } from '../SignalBoxComponent/SignalBoxComponent';
import { SignalBarraComponente } from "../SignalBarraComponente/SignalBarraComponente";

@Component({
  selector: 'app-estilos-page',
  
  imports: [SignalBoxComponent, SignalBarraComponente],
  templateUrl: './estilos-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstilosPage {

 }
