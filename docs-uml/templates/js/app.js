/**
 * app.js — Controlador principal de la vista interactiva.
 * 
 * Orquesta la carga del manifiesto, inicialización del grafo,
 * filtros de capa/tipo, búsqueda, panel de detalle, y navegación.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // ── Estado de la aplicación ────────────────────────────────────
  const state = {
    activeLayers: [],    // IDs de capas activas (todas por defecto)
    activeTypes: [],     // Tipos activos (vacío = todos)
    selectedNode: null,  // Nodo actualmente seleccionado
    searchQuery: '',     // Término de búsqueda actual
    currentView: 'graph', // 'graph' o 'diagram'
  };

  // ── Elementos DOM ──────────────────────────────────────────────
  const dom = {
    projectName: document.getElementById('project-name'),
    projectVersion: document.getElementById('project-version'),
    searchInput: document.getElementById('search-input'),
    layerFilters: document.getElementById('layer-filters'),
    typeFilters: document.getElementById('type-filters'),
    statsContent: document.getElementById('stats-content'),
    diagramsList: document.getElementById('diagrams-list'),
    detailPanel: document.getElementById('detail-panel'),
    detailContent: document.getElementById('detail-content'),
    graphView: document.getElementById('graph-view'),
    diagramView: document.getElementById('diagram-view'),
    diagramTitle: document.getElementById('diagram-title'),
    diagramType: document.getElementById('diagram-type'),
    diagramContent: document.getElementById('diagram-content'),
    diagramMeta: document.getElementById('diagram-meta'),
    btnCloseDetail: document.getElementById('btn-close-detail'),
    btnBackToGraph: document.getElementById('btn-back-to-graph'),
    btnToggleView: document.getElementById('btn-toggle-view'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnFit: document.getElementById('btn-fit'),
    btnReset: document.getElementById('btn-reset'),
  };

  // ── Cargar manifiesto ──────────────────────────────────────────
  const manifest = await ManifestLoader.load();
  if (!manifest) {
    document.getElementById('graph-container').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📄</div>
        <div class="empty-state-title">No se pudo cargar el manifiesto</div>
        <div class="empty-state-text">
          Verificar que data/manifest.json existe y es válido.
        </div>
      </div>
    `;
    return;
  }

  // ── Inicializar UI ─────────────────────────────────────────────
  const project = ManifestLoader.getProject();
  dom.projectName.textContent = project.name || 'Arquitectura UML';
  dom.projectVersion.textContent = `v${project.version || '0.0.0'}`;
  document.title = `${project.name || 'UML'} — Arquitectura Interactiva`;

  // Inicializar capas activas (todas)
  state.activeLayers = ManifestLoader.getLayers().map(l => l.id);

  renderLayerFilters();
  renderTypeFilters();
  renderStats();
  renderDiagramsList();

  // ── Inicializar grafo ──────────────────────────────────────────
  GraphRenderer.init('graph-container');
  GraphRenderer.loadFromManifest();

  // Eventos de grafo
  GraphRenderer.on('tap', 'node', (evt) => {
    const nodeId = evt.target.id();
    selectNode(nodeId);
  });

  GraphRenderer.on('tap', (evt) => {
    if (evt.target === GraphRenderer.getCy()) {
      deselectNode();
    }
  });

  // ── Renderizar filtros de capa ─────────────────────────────────
  function renderLayerFilters() {
    const layers = ManifestLoader.getLayers();
    const counts = ManifestLoader.countNodesByLayer();
    dom.layerFilters.innerHTML = '';

    for (const layer of layers) {
      const chip = document.createElement('div');
      chip.className = 'layer-chip active';
      chip.dataset.layerId = layer.id;

      chip.innerHTML = `
        <div class="layer-dot" style="color: ${layer.color || '#64748b'}; background-color: ${layer.color || '#64748b'}"></div>
        <span class="layer-chip-label">${escapeHtml(layer.name)}</span>
        <span class="layer-chip-count">${counts[layer.id] || 0}</span>
      `;

      chip.addEventListener('click', () => toggleLayer(layer.id, chip));
      dom.layerFilters.appendChild(chip);
    }
  }

  function toggleLayer(layerId, chipEl) {
    const idx = state.activeLayers.indexOf(layerId);
    if (idx >= 0) {
      state.activeLayers.splice(idx, 1);
      chipEl.classList.remove('active');
      chipEl.classList.add('inactive');
    } else {
      state.activeLayers.push(layerId);
      chipEl.classList.add('active');
      chipEl.classList.remove('inactive');
    }
    GraphRenderer.filterByLayers(state.activeLayers);
  }

  // ── Renderizar filtros de tipo ─────────────────────────────────
  function renderTypeFilters() {
    const types = ManifestLoader.getNodeTypes();
    dom.typeFilters.innerHTML = '';

    const typeLabels = {
      module: '📦 Módulo',
      service: '⚙️ Servicio',
      database: '🗄️ BD',
      api: '🔌 API',
      component: '🧩 Componente',
      external: '🌐 Externo',
      library: '📚 Librería',
      middleware: '🔗 Middleware',
      entity: '📋 Entidad',
      other: '❓ Otro',
    };

    for (const type of types) {
      const chip = document.createElement('span');
      chip.className = 'type-chip';
      chip.dataset.type = type;
      chip.textContent = typeLabels[type] || type;

      chip.addEventListener('click', () => toggleType(type, chip));
      dom.typeFilters.appendChild(chip);
    }
  }

  function toggleType(type, chipEl) {
    const idx = state.activeTypes.indexOf(type);
    if (idx >= 0) {
      state.activeTypes.splice(idx, 1);
      chipEl.classList.remove('active');
    } else {
      state.activeTypes.push(type);
      chipEl.classList.add('active');
    }
    GraphRenderer.filterByTypes(state.activeTypes);
  }

  // ── Renderizar estadísticas ────────────────────────────────────
  function renderStats() {
    const stats = ManifestLoader.getStats();
    dom.statsContent.innerHTML = `
      <div class="stat-row"><span class="stat-label">Capas</span><span class="stat-value">${stats.layers}</span></div>
      <div class="stat-row"><span class="stat-label">Nodos</span><span class="stat-value">${stats.nodes}</span></div>
      <div class="stat-row"><span class="stat-label">Relaciones</span><span class="stat-value">${stats.relations}</span></div>
      <div class="stat-row"><span class="stat-label">Diagramas</span><span class="stat-value">${stats.diagrams}</span></div>
    `;
  }

  // ── Renderizar lista de diagramas ──────────────────────────────
  function renderDiagramsList() {
    const diagrams = ManifestLoader.getDiagrams();
    dom.diagramsList.innerHTML = '';

    const typeIcons = {
      'use-case': '👤',
      class: '📐',
      sequence: '↔️',
      activity: '🔄',
      component: '🧩',
      deployment: '🖥️',
      er: '🗃️',
      state: '🔀',
      package: '📦',
      flowchart: '📊',
      architecture: '🏛️',
      other: '📄',
    };

    for (const diag of diagrams) {
      const item = document.createElement('div');
      item.className = 'diagram-item';
      item.dataset.diagramId = diag.id;

      item.innerHTML = `
        <span class="diagram-item-icon">${typeIcons[diag.type] || '📄'}</span>
        <span class="diagram-item-title" title="${escapeHtml(diag.title)}">${escapeHtml(diag.title)}</span>
        <span class="diagram-item-badge">${diag.type || ''}</span>
      `;

      item.addEventListener('click', () => showDiagram(diag.id));
      dom.diagramsList.appendChild(item);
    }
  }

  // ── Selección de nodo ──────────────────────────────────────────
  function selectNode(nodeId) {
    state.selectedNode = nodeId;
    const node = ManifestLoader.getNode(nodeId);
    if (!node) return;

    GraphRenderer.highlightNode(nodeId);
    renderDetailPanel(node);
    dom.detailPanel.classList.remove('hidden');
  }

  function deselectNode() {
    state.selectedNode = null;
    GraphRenderer.clearHighlight();
    dom.detailPanel.classList.add('hidden');
  }

  // ── Panel de detalle ───────────────────────────────────────────
  function renderDetailPanel(node) {
    const layer = ManifestLoader.getLayer(node.layer);
    const outgoing = ManifestLoader.getOutgoingRelations(node.id);
    const incoming = ManifestLoader.getIncomingRelations(node.id);
    const diagrams = ManifestLoader.getDiagramsForNode(node.id);

    let html = `
      <div class="detail-header animate-fadeIn">
        <div class="detail-node-name">${escapeHtml(node.name)}</div>
        <span class="detail-node-type" style="background: ${layer?.color || '#64748b'}20; color: ${layer?.color || '#64748b'}; border: 1px solid ${layer?.color || '#64748b'}40;">
          ${layer?.name || node.layer} · ${node.type || 'N/A'}
        </span>
      </div>
    `;

    // Descripción
    if (node.description) {
      html += `
        <div class="detail-section animate-fadeIn">
          <div class="detail-section-title">Descripción</div>
          <div class="detail-description">${escapeHtml(node.description)}</div>
        </div>
      `;
    }

    // Tags
    if (node.tags && node.tags.length > 0) {
      html += `
        <div class="detail-section animate-fadeIn">
          <div class="detail-section-title">Tags</div>
          <div>${node.tags.map(t => `<span class="detail-tag">${escapeHtml(t)}</span>`).join('')}</div>
        </div>
      `;
    }

    // Relaciones salientes
    if (outgoing.length > 0) {
      html += `
        <div class="detail-section animate-fadeIn">
          <div class="detail-section-title">Relaciones salientes (${outgoing.length})</div>
          ${outgoing.map(r => {
            const target = ManifestLoader.getNode(r.to);
            return `
              <div class="detail-relation" data-node-id="${r.to}">
                <span class="detail-relation-arrow">→</span>
                <span class="detail-relation-name">${escapeHtml(target?.name || r.to)}</span>
                <span class="detail-relation-type">${r.type}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Relaciones entrantes
    if (incoming.length > 0) {
      html += `
        <div class="detail-section animate-fadeIn">
          <div class="detail-section-title">Relaciones entrantes (${incoming.length})</div>
          ${incoming.map(r => {
            const source = ManifestLoader.getNode(r.from);
            return `
              <div class="detail-relation" data-node-id="${r.from}">
                <span class="detail-relation-arrow">←</span>
                <span class="detail-relation-name">${escapeHtml(source?.name || r.from)}</span>
                <span class="detail-relation-type">${r.type}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Diagramas relacionados
    if (diagrams.length > 0) {
      html += `
        <div class="detail-section animate-fadeIn">
          <div class="detail-section-title">Diagramas (${diagrams.length})</div>
          ${diagrams.map(d => `
            <div class="detail-diagram-link" data-diagram-id="${d.id}">
              📊 ${escapeHtml(d.title)}
            </div>
          `).join('')}
        </div>
      `;
    }

    dom.detailContent.innerHTML = html;

    // Eventos en relaciones (click para navegar)
    dom.detailContent.querySelectorAll('.detail-relation').forEach(el => {
      el.addEventListener('click', () => {
        const targetId = el.dataset.nodeId;
        GraphRenderer.focusNode(targetId);
        selectNode(targetId);
      });
    });

    // Eventos en diagramas
    dom.detailContent.querySelectorAll('.detail-diagram-link').forEach(el => {
      el.addEventListener('click', () => {
        showDiagram(el.dataset.diagramId);
      });
    });
  }

  // ── Vista de diagrama ──────────────────────────────────────────
  function showDiagram(diagramId) {
    const diagram = ManifestLoader.getDiagram(diagramId);
    if (!diagram) return;

    state.currentView = 'diagram';
    dom.graphView.classList.remove('active');
    dom.diagramView.classList.add('active');

    dom.diagramTitle.textContent = diagram.title;
    dom.diagramType.textContent = diagram.type || '';

    // Intentar cargar SVG renderizado
    const svgPath = `diagrams/${diagram.id}.svg`;
    const pngPath = `diagrams/${diagram.id}.png`;

    dom.diagramContent.innerHTML = `
      <div class="loading-spinner"></div>
    `;

    // Intentar SVG primero, luego PNG
    const img = new Image();
    img.onload = () => {
      dom.diagramContent.innerHTML = '';
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      dom.diagramContent.appendChild(img);
    };
    img.onerror = () => {
      // Intentar PNG
      const imgPng = new Image();
      imgPng.onload = () => {
        dom.diagramContent.innerHTML = '';
        imgPng.style.maxWidth = '100%';
        imgPng.style.height = 'auto';
        dom.diagramContent.appendChild(imgPng);
      };
      imgPng.onerror = () => {
        dom.diagramContent.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">📄</div>
            <div class="empty-state-title">Diagrama no renderizado</div>
            <div class="empty-state-text">
              Ejecutar <code>python scripts/render_plantuml.py</code> para generar los SVGs.
              <br><br>
              <strong>Fuente:</strong> ${escapeHtml(diagram.source || 'N/A')}
            </div>
          </div>
        `;
      };
      imgPng.src = pngPath;
    };
    img.src = svgPath;

    // Meta
    dom.diagramMeta.innerHTML = `
      <strong>Tipo:</strong> ${diagram.type || 'N/A'} · 
      <strong>Formato:</strong> ${diagram.format || 'N/A'} · 
      <strong>Fuente:</strong> ${escapeHtml(diagram.source || 'N/A')}
      ${diagram.description ? `<br>${escapeHtml(diagram.description)}` : ''}
    `;
  }

  function backToGraph() {
    state.currentView = 'graph';
    dom.diagramView.classList.remove('active');
    dom.graphView.classList.add('active');
  }

  // ── Búsqueda ───────────────────────────────────────────────────
  let searchTimeout = null;

  function handleSearch(query) {
    state.searchQuery = query;

    if (!query || query.length < 2) {
      GraphRenderer.clearHighlight();
      return;
    }

    const results = ManifestLoader.search(query);
    const nodeIds = results.nodes.map(n => n.id);
    GraphRenderer.highlightSearchResults(nodeIds);
  }

  dom.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      handleSearch(e.target.value);
    }, 200);
  });

  dom.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dom.searchInput.value = '';
      handleSearch('');
      dom.searchInput.blur();
    }
  });

  // Ctrl+K para enfocar búsqueda
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      dom.searchInput.focus();
      dom.searchInput.select();
    }
    if (e.key === 'Escape') {
      deselectNode();
      if (state.currentView === 'diagram') {
        backToGraph();
      }
    }
  });

  // ── Event listeners ────────────────────────────────────────────
  dom.btnCloseDetail.addEventListener('click', deselectNode);
  dom.btnBackToGraph.addEventListener('click', backToGraph);
  dom.btnToggleView.addEventListener('click', () => {
    if (state.currentView === 'graph') {
      // Si hay diagrams, mostrar el primero
      const diagrams = ManifestLoader.getDiagrams();
      if (diagrams.length > 0) {
        showDiagram(diagrams[0].id);
      }
    } else {
      backToGraph();
    }
  });

  dom.btnZoomIn.addEventListener('click', () => GraphRenderer.zoomIn());
  dom.btnZoomOut.addEventListener('click', () => GraphRenderer.zoomOut());
  dom.btnFit.addEventListener('click', () => GraphRenderer.fit());
  dom.btnReset.addEventListener('click', () => {
    // Resetear todos los filtros
    state.activeLayers = ManifestLoader.getLayers().map(l => l.id);
    state.activeTypes = [];
    state.searchQuery = '';
    dom.searchInput.value = '';

    // Resetear chips
    dom.layerFilters.querySelectorAll('.layer-chip').forEach(c => {
      c.classList.add('active');
      c.classList.remove('inactive');
    });
    dom.typeFilters.querySelectorAll('.type-chip').forEach(c => {
      c.classList.remove('active');
    });

    GraphRenderer.showAll();
    GraphRenderer.fit();
    deselectNode();
  });

  // ── Utilidades ─────────────────────────────────────────────────
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Ajustar tamaño del grafo al redimensionar ventana ──────────
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const cy = GraphRenderer.getCy();
      if (cy) cy.resize();
    }, 200);
  });
});
