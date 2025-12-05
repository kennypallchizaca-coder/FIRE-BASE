import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodePage } from "./Component/code-page/code-page";
import { TablePage } from "./Component/table-page/table-page";
import { CradComponnete } from "./Component/Crad-componnete/Crad-componnete";
import { CardResponsibilidad } from "./Component/card-responsibilidad/card-responsibilidad";
import { HoverGalaryPage } from "./Component/hover-galary-page/hover-galary-page";
import { Card3dPage } from "./Component/card3d_page/card3d_page";


@Component({
  selector: 'app-daisy-page',
  imports: [  CodePage, TablePage, CradComponnete, CardResponsibilidad, HoverGalaryPage, Card3dPage],
  templateUrl: './daisy-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaisyPage { }
