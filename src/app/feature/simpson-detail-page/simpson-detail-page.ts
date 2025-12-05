import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SimpsonsService } from '../Simpsons/Service/SimpsonsService';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-simpson-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './simpson-detail-page.html',
  styleUrl: './simpson-detail-page.css',
})
export class SimpsonDetailPage {
  private route = inject(ActivatedRoute);
  private service = inject(SimpsonsService);

  readonly placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

  personaje = toSignal(
    this.route.paramMap.pipe(
      map(params => +params.get('id')!),
      switchMap(id => this.service.getCharacterById(id))
    ),
    { initialValue: null }
  );

  buildImageUrl(imagePath?: string | null): string {
    if (!imagePath) return this.placeholderImage;
    if (imagePath.startsWith('http')) return imagePath;

    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `https://cdn.thesimpsonsapi.com/500${normalizedPath}`;
  }
}
