const layer = document.querySelector('#map-markers');
const markerSvg = document.querySelector('#world-map');
const empty = document.querySelector('#map-empty');
const bubble = document.querySelector('#map-place-bubble');
const viewport = document.querySelector('#map-viewport');
const world = document.querySelector('#map-world');
const worldTransform = document.querySelector('#world-transform');
const mapArt = document.querySelector('.world-map-art');
const wrappedWorlds = [-2, -1, 1, 2].map(offset => {
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#world-transform');
  use.setAttribute('aria-hidden', 'true');
  use.setAttribute('pointer-events', 'none');
  mapArt.appendChild(use);
  return {offset, element: use};
});
const canvas = document.querySelector('.map-canvas');
const places = window.MAP_PLACES || [];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

layer.innerHTML = places.map(place => {
  const [longitude, latitude] = place.coordinates;
  const x = ((((Number(longitude) - 160 + 180) % 360 + 360) % 360) / 360 * 1000).toFixed(2);
  const y = ((90 - Number(latitude)) / 180 * 500).toFixed(2);
  const name = escapeHTML(place.name || place.place || '旅行地点');
  return [-2, -1, 0, 1, 2].map(copy => `<g class="map-marker ${place.type === 'together' ? 'is-together' : 'is-solo'} ${copy ? 'is-wrap-copy' : ''}" tabindex="${copy ? '-1' : '0'}" ${copy ? 'aria-hidden="true"' : 'role="button" aria-label="显示' + name + '"'} data-copy="${copy}" data-name="${name}" data-x="${x}" data-y="${y}"><circle class="map-marker-hit" r="13"/><circle class="map-dot" r="3.2"/></g>`).join('');
}).join('');
empty.hidden = places.length > 0;

let scale = 1, translateX = 0, translateY = 0, sceneWidth = 0, sceneHeight = 0;
let initialized = false, activeMarker = null, drag = null, pinch = null, suppressClick = false;
const pointers = new Map();
let minScale = 1;
const maxScale = 16;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a, b) => ({x: (a.x + b.x) / 2, y: (a.y + b.y) / 2});
const localPoint = event => {
  const rect = viewport.getBoundingClientRect();
  return {x: event.clientX - rect.left, y: event.clientY - rect.top};
};

function limitTranslation() {
  const width = sceneWidth * scale, height = sceneHeight * scale;
  // Repeat the world horizontally so panning never hits a left or right edge.
  if (width > 0) translateX = ((translateX % width) + width) % width - width;
  if (height <= viewport.clientHeight) translateY = (viewport.clientHeight - height) / 2;
  else translateY = clamp(translateY, viewport.clientHeight - height, 0);
}
function updateMarkerPositions() {
  for (const marker of layer.querySelectorAll('.map-marker')) {
    const x = Number(marker.dataset.x) / 1000 * sceneWidth * scale + translateX + Number(marker.dataset.copy) * sceneWidth * scale;
    const y = Number(marker.dataset.y) / 500 * sceneHeight * scale + translateY;
    marker.setAttribute('transform', `translate(${x} ${y})`);
  }
}
function positionBubble() {
  if (!activeMarker || bubble.hidden) return;
  const markerRect = activeMarker.getBoundingClientRect(), canvasRect = canvas.getBoundingClientRect();
  bubble.style.left = `${markerRect.left + markerRect.width / 2 - canvasRect.left}px`;
  bubble.style.top = `${markerRect.top + markerRect.height / 2 - canvasRect.top}px`;
}
function renderTransform() {
  limitTranslation();
  const x = translateX / sceneWidth * 1000;
  const y = translateY / sceneHeight * 500;
  worldTransform.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`);
  for (const {offset, element} of wrappedWorlds) {
    element.setAttribute('transform', `translate(${offset * 1000 * scale} 0)`);
  }
  worldTransform.querySelector('#world-land')?.setAttribute('stroke-width', String(.72 / scale));
  worldTransform.querySelector('#china-provinces')?.setAttribute('stroke-width', String(.68 / scale));
  worldTransform.querySelector('#australia-states')?.setAttribute('stroke-width', String(.68 / scale));
  world.classList.toggle('show-admin-regions', scale >= 2.2);
  updateMarkerPositions();
  positionBubble();
}
function fitScene() {
  const width = viewport.clientWidth;
  if (!width) return;
  sceneWidth = width;
  sceneHeight = width / 2;
  minScale = Math.max(1, viewport.clientHeight / sceneHeight);
  if (scale < minScale) scale = minScale;
  world.style.width = `${sceneWidth}px`;
  world.style.height = `${sceneHeight}px`;
  markerSvg.setAttribute('width', String(viewport.clientWidth));
  markerSvg.setAttribute('height', String(viewport.clientHeight));
  markerSvg.setAttribute('viewBox', `0 0 ${viewport.clientWidth} ${viewport.clientHeight}`);
  if (!initialized) {
    const mobileFit = viewport.clientHeight / sceneHeight;
    scale = clamp(Math.max(minScale, mobileFit), minScale, 1.42);
    translateX = (viewport.clientWidth - sceneWidth * scale) / 2;
    translateY = (viewport.clientHeight - sceneHeight * scale) / 2;
    initialized = true;
  }
  renderTransform();
}
function zoomAt(nextScale, point) {
  const next = clamp(nextScale, minScale, maxScale);
  const worldX = (point.x - translateX) / scale, worldY = (point.y - translateY) / scale;
  translateX = point.x - worldX * next;
  translateY = point.y - worldY * next;
  scale = next;
  renderTransform();
}
function updateBubble(marker) {
  activeMarker = marker;
  bubble.textContent = marker.dataset.name;
  bubble.hidden = false;
  positionBubble();
}

viewport.addEventListener('wheel', event => {
  event.preventDefault();
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1;
  const delta = clamp(event.deltaY * unit, -260, 260);
  const sensitivity = event.ctrlKey ? .007 : .0038;
  zoomAt(scale * Math.exp(-delta * sensitivity), localPoint(event));
}, {passive: false});

viewport.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  const point = localPoint(event);
  pointers.set(event.pointerId, point);
  suppressClick = false;
  if (pointers.size === 1) {
    drag = {id: event.pointerId, start: point, x: translateX, y: translateY, moved: false};
    pinch = null;
    viewport.classList.add('is-dragging');
  } else if (pointers.size >= 2) {
    const [a, b] = [...pointers.values()].slice(0, 2);
    const center = midpoint(a, b);
    pinch = {distance: distance(a, b), scale, x: (center.x - translateX) / scale, y: (center.y - translateY) / scale};
    drag = null;
  }
}, {passive: true});

window.addEventListener('pointermove', event => {
  if (!pointers.has(event.pointerId)) return;
  const point = localPoint(event);
  pointers.set(event.pointerId, point);
  if (pointers.size >= 2 && pinch) {
    const [a, b] = [...pointers.values()].slice(0, 2), center = midpoint(a, b);
    const pinchRatio = distance(a, b) / Math.max(1, pinch.distance);
    const next = clamp(pinch.scale * Math.pow(pinchRatio, 1.22), minScale, maxScale);
    translateX = center.x - pinch.x * next;
    translateY = center.y - pinch.y * next;
    scale = next;
    renderTransform();
    suppressClick = true;
  } else if (drag && drag.id === event.pointerId) {
    const dx = point.x - drag.start.x, dy = point.y - drag.start.y;
    if (Math.hypot(dx, dy) > 5) drag.moved = true;
    if (drag.moved) {
      translateX = drag.x + dx;
      translateY = drag.y + dy;
      renderTransform();
      suppressClick = true;
    }
  }
}, {passive: true});

window.addEventListener('pointerup', event => {
  if (!pointers.has(event.pointerId)) return;
  pointers.delete(event.pointerId);
  viewport.classList.remove('is-dragging');
  if (pointers.size >= 2) {
    const [a, b] = [...pointers.values()].slice(0, 2), center = midpoint(a, b);
    pinch = {distance: distance(a, b), scale, x: (center.x - translateX) / scale, y: (center.y - translateY) / scale};
  } else if (pointers.size === 1) {
    const [id, point] = [...pointers.entries()][0];
    drag = {id, start: point, x: translateX, y: translateY, moved: false};
    pinch = null;
  } else {
    drag = null;
    pinch = null;
    setTimeout(() => { suppressClick = false; }, 0);
  }
}, {passive: true});
window.addEventListener('pointercancel', event => {
  pointers.delete(event.pointerId);
  if (!pointers.size) {
    drag = null;
    pinch = null;
    viewport.classList.remove('is-dragging');
  }
}, {passive: true});
viewport.addEventListener('click', event => {
  if (suppressClick) {
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }
}, true);

layer.querySelectorAll('.map-marker').forEach(marker => {
  marker.addEventListener('click', event => { event.stopPropagation(); updateBubble(marker); });
  marker.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      updateBubble(marker);
    }
  });
});
canvas.addEventListener('click', event => {
  if (!event.target.closest('.map-marker') && !event.target.closest('#map-place-bubble')) {
    bubble.hidden = true;
    activeMarker = null;
  }
});
viewport.addEventListener('keydown', event => {
  if (event.key === 'Escape') { bubble.hidden = true; activeMarker = null; }
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault();
    const amount = 48;
    if (event.key === 'ArrowLeft') translateX += amount;
    if (event.key === 'ArrowRight') translateX -= amount;
    if (event.key === 'ArrowUp') translateY += amount;
    if (event.key === 'ArrowDown') translateY -= amount;
    renderTransform();
  }
});

new ResizeObserver(fitScene).observe(viewport);
fitScene();
