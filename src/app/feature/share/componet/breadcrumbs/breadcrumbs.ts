import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  imports: [],
  templateUrl: './breadcrumbs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumbs { 
  items = input<{ label: string; link?: string }[]>([]);
}
