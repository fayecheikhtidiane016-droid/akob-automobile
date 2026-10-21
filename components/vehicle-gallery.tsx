'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function VehicleGallery({ images, category, year }: { images: string[]; category: string; year: number }) {
  const gallery = images.filter(Boolean);
  const [active, setActive] = useState(0);
  if (!gallery.length) return <div className="detail-hero detail-image-empty"><span className="vehicle-category">{category}</span><span className="detail-count">AKOB · {year}</span></div>;
  const previous = () => setActive((index) => (index - 1 + gallery.length) % gallery.length);
  const next = () => setActive((index) => (index + 1) % gallery.length);
  return <div className="vehicle-gallery"><div className="detail-hero" style={{ backgroundImage: `url("${gallery[active]}")` }}><span className="vehicle-category">{category}</span><span className="detail-count">{String(active + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span>{gallery.length > 1 && <><button className="gallery-arrow gallery-prev" aria-label="Photo précédente" onClick={previous}><ChevronLeft size={20} /></button><button className="gallery-arrow gallery-next" aria-label="Photo suivante" onClick={next}><ChevronRight size={20} /></button></>}</div>{gallery.length > 1 && <div className="gallery-thumbnails">{gallery.map((image, index) => <button key={`${image}-${index}`} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)} aria-label={`Afficher la photo ${index + 1}`} style={{ backgroundImage: `url("${image}")` }} />)}</div>}</div>;
}