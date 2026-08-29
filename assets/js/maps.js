// LocalJobs.de — Leaflet / OpenStreetMap helpers
window.__ljMaps = window.__ljMaps || [];
window.__ljAutoOpenMarkers = window.__ljAutoOpenMarkers || [];

function ljPinIcon(count) {
  return L.divIcon({
    className: 'map-pin',
    html: '<div class="dot">' + count + '</div>',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });
}

function ljSingleIcon() {
  return L.divIcon({
    className: 'map-pin single',
    html: '<div class="dot"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26],
  });
}

function ljJobPopupHtml(job) {
  return (
    '<div class="map-popup-card">' +
      '<div class="row">' +
        '<div class="logo"><img src="' + job.logo + '" alt=""></div>' +
        '<div><strong>' + job.title + '</strong><span>' + job.company + '</span></div>' +
      '</div>' +
      '<span class="meta-line">' + job.meta + '</span>' +
      '<a href="' + job.href + '" class="btn btn-primary btn-sm btn-block">Anzeigen</a>' +
    '</div>'
  );
}

function ljCreateMap(containerId, opts) {
  const el = document.getElementById(containerId);
  if (!el || typeof L === 'undefined') return null;

  const map = L.map(containerId, { zoomControl: false, scrollWheelZoom: false })
    .setView(opts.center, opts.zoom || 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.control.zoom({ position: 'topright' }).addTo(map);

  (opts.markers || []).forEach(m => {
    const icon = m.single ? ljSingleIcon() : ljPinIcon(m.count);
    const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
    if (m.popupHtml) marker.bindPopup(m.popupHtml, { minWidth: 200 });
    if (m.openPopup) {
      marker.openPopup();
      window.__ljAutoOpenMarkers.push(marker);
    }
  });

  window.__ljMaps.push(map);
  return map;
}

// call after a map's container becomes visible (tab switch, view toggle, etc.)
function ljRefreshMaps() {
  window.__ljMaps.forEach(m => {
    try { m.invalidateSize(); } catch (e) {}
  });
  // re-run autoPan for pre-opened popups now that the container has its real size
  window.__ljAutoOpenMarkers.forEach(marker => {
    try { if (marker.isPopupOpen()) marker.openPopup(); } catch (e) {}
  });
}
