/**
 * graph.js — Renderizado de grafos con Cytoscape.js.
 * 
 * Convierte nodos y relaciones del manifiesto en un grafo interactivo
 * con nodos coloreados por capa, edges tipados, layout automático,
 * zoom, pan, y selección.
 */

const GraphRenderer = (() => {
  let _cy = null;
  let _container = null;

  // Mapeo de tipo de nodo a forma de Cytoscape
  const NODE_SHAPES = {
    module: 'round-rectangle',
    service: 'ellipse',
    database: 'barrel',
    api: 'diamond',
    component: 'round-rectangle',
    external: 'octagon',
    library: 'round-hexagon',
    middleware: 'round-pentagon',
    entity: 'rectangle',
    other: 'ellipse',
  };

  // Mapeo de tipo de relación a estilo de línea
  const EDGE_STYLES = {
    uses: { lineStyle: 'solid', arrowShape: 'triangle' },
    'depends-on': { lineStyle: 'solid', arrowShape: 'triangle' },
    calls: { lineStyle: 'solid', arrowShape: 'vee' },
    extends: { lineStyle: 'dashed', arrowShape: 'triangle-backcurve' },
    implements: { lineStyle: 'dashed', arrowShape: 'triangle' },
    contains: { lineStyle: 'dotted', arrowShape: 'circle' },
    reads: { lineStyle: 'solid', arrowShape: 'vee' },
    writes: { lineStyle: 'solid', arrowShape: 'triangle' },
    proxies: { lineStyle: 'dashed', arrowShape: 'vee' },
    authenticates: { lineStyle: 'solid', arrowShape: 'diamond' },
    audits: { lineStyle: 'dotted', arrowShape: 'vee' },
    other: { lineStyle: 'solid', arrowShape: 'triangle' },
  };

  /**
   * Inicializar el grafo en un contenedor DOM.
   */
  function init(containerId) {
    _container = document.getElementById(containerId);
    if (!_container) {
      console.error('[GraphRenderer] Contenedor no encontrado:', containerId);
      return;
    }

    // Verificar que cytoscape esté disponible
    if (typeof cytoscape === 'undefined') {
      _container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <div class="empty-state-title">Cytoscape.js no disponible</div>
          <div class="empty-state-text">
            Descargar cytoscape.min.js y colocarlo en vendor/.
          </div>
        </div>
      `;
      return;
    }

    _cy = cytoscape({
      container: _container,
      style: _getStylesheet(),
      layout: { name: 'preset' }, // Se aplica layout luego
      minZoom: 0.2,
      maxZoom: 3,
      wheelSensitivity: 0.3,
      boxSelectionEnabled: false,
      autounselectify: false,
    });
  }

  /**
   * Cargar datos del manifiesto al grafo.
   */
  function loadFromManifest() {
    if (!_cy) return;

    const nodes = ManifestLoader.getNodes();
    const relations = ManifestLoader.getRelations();
    const layers = ManifestLoader.getLayers();

    // Crear mapa de colores de capas
    const layerColors = {};
    for (const layer of layers) {
      layerColors[layer.id] = layer.color || '#64748b';
    }

    // Agregar nodos
    const elements = [];
    for (const node of nodes) {
      elements.push({
        group: 'nodes',
        data: {
          id: node.id,
          label: node.name,
          layer: node.layer,
          type: node.type || 'other',
          description: node.description || '',
          color: layerColors[node.layer] || '#64748b',
          shape: NODE_SHAPES[node.type] || 'ellipse',
          tags: (node.tags || []).join(', '),
        },
      });
    }

    // Agregar edges
    for (let i = 0; i < relations.length; i++) {
      const rel = relations[i];
      const style = EDGE_STYLES[rel.type] || EDGE_STYLES.other;
      elements.push({
        group: 'edges',
        data: {
          id: `e${i}`,
          source: rel.from,
          target: rel.to,
          label: rel.label || '',
          relType: rel.type || 'other',
          lineStyle: style.lineStyle,
          arrowShape: style.arrowShape,
        },
      });
    }

    _cy.add(elements);
    _applyLayout();
  }

  /**
   * Generar stylesheet de Cytoscape.
   */
  function _getStylesheet() {
    return [
      // Nodos
      {
        selector: 'node',
        style: {
          label: 'data(label)',
          'background-color': 'data(color)',
          'background-opacity': 0.15,
          'border-width': 2,
          'border-color': 'data(color)',
          'border-opacity': 0.7,
          shape: 'data(shape)',
          width: 55,
          height: 40,
          'font-size': '10px',
          'font-family': "'Inter', 'Segoe UI', system-ui, sans-serif",
          'font-weight': 500,
          color: '#e2e8f0',
          'text-valign': 'bottom',
          'text-halign': 'center',
          'text-margin-y': 6,
          'text-max-width': '90px',
          'text-wrap': 'ellipsis',
          'text-outline-width': 2,
          'text-outline-color': '#0a0e1a',
          'text-outline-opacity': 0.8,
          'overlay-opacity': 0,
          'transition-property': 'background-opacity, border-width, width, height, opacity',
          'transition-duration': '200ms',
          'transition-timing-function': 'ease-in-out',
        },
      },
      // Nodo hover
      {
        selector: 'node:active, node:selected',
        style: {
          'background-opacity': 0.35,
          'border-width': 3,
          width: 65,
          height: 48,
          'z-index': 10,
        },
      },
      // Nodo resaltado
      {
        selector: 'node.highlighted',
        style: {
          'background-opacity': 0.4,
          'border-width': 3,
          'border-opacity': 1,
          width: 65,
          height: 48,
          'z-index': 10,
        },
      },
      // Nodo atenuado
      {
        selector: 'node.dimmed',
        style: {
          opacity: 0.15,
          'text-opacity': 0.1,
        },
      },
      // Nodo de búsqueda encontrado
      {
        selector: 'node.search-match',
        style: {
          'background-opacity': 0.5,
          'border-width': 3,
          'border-color': '#60a5fa',
          'border-opacity': 1,
          width: 65,
          height: 48,
          'z-index': 20,
        },
      },
      // Edges
      {
        selector: 'edge',
        style: {
          width: 1.5,
          'line-color': 'rgba(148, 163, 184, 0.25)',
          'target-arrow-color': 'rgba(148, 163, 184, 0.35)',
          'target-arrow-shape': 'data(arrowShape)',
          'line-style': 'data(lineStyle)',
          'curve-style': 'bezier',
          'arrow-scale': 0.8,
          label: '',
          'font-size': '8px',
          color: '#64748b',
          'text-rotation': 'autorotate',
          'text-margin-y': -8,
          'text-outline-width': 1.5,
          'text-outline-color': '#0a0e1a',
          'text-outline-opacity': 0.6,
          'overlay-opacity': 0,
          'transition-property': 'line-color, target-arrow-color, width, opacity',
          'transition-duration': '200ms',
        },
      },
      // Edge resaltado
      {
        selector: 'edge.highlighted',
        style: {
          width: 2.5,
          'line-color': 'rgba(96, 165, 250, 0.6)',
          'target-arrow-color': 'rgba(96, 165, 250, 0.7)',
          label: 'data(label)',
          'z-index': 10,
        },
      },
      // Edge atenuado
      {
        selector: 'edge.dimmed',
        style: {
          opacity: 0.06,
        },
      },
    ];
  }

  /**
   * Aplicar layout (cose-bilkent style manual).
   */
  function _applyLayout() {
    if (!_cy) return;

    _cy.layout({
      name: 'cose',
      animate: true,
      animationDuration: 800,
      animationEasing: 'ease-out',
      padding: 50,
      nodeRepulsion: 8000,
      idealEdgeLength: 120,
      edgeElasticity: 100,
      nestingFactor: 1.2,
      gravity: 0.25,
      numIter: 1000,
      randomize: true,
      componentSpacing: 80,
      nodeOverlap: 20,
    }).run();
  }

  /**
   * Resaltar un nodo y sus vecinos.
   */
  function highlightNode(nodeId) {
    if (!_cy) return;

    const node = _cy.getElementById(nodeId);
    if (!node || node.empty()) return;

    // Atenuar todo
    _cy.elements().addClass('dimmed');

    // Resaltar nodo seleccionado y vecinos
    const neighborhood = node.neighborhood().add(node);
    neighborhood.removeClass('dimmed').addClass('highlighted');
  }

  /**
   * Limpiar resaltado.
   */
  function clearHighlight() {
    if (!_cy) return;
    _cy.elements().removeClass('dimmed highlighted search-match');
  }

  /**
   * Resaltar nodos por resultado de búsqueda.
   */
  function highlightSearchResults(nodeIds) {
    if (!_cy) return;
    clearHighlight();

    if (nodeIds.length === 0) return;

    _cy.elements().addClass('dimmed');
    for (const id of nodeIds) {
      const node = _cy.getElementById(id);
      if (node && !node.empty()) {
        node.removeClass('dimmed').addClass('search-match');
        // También mostrar edges conectados
        node.connectedEdges().removeClass('dimmed');
        node.neighborhood('node').removeClass('dimmed');
      }
    }
  }

  /**
   * Filtrar nodos por capas activas.
   */
  function filterByLayers(activeLayerIds) {
    if (!_cy) return;

    _cy.nodes().forEach(node => {
      const layer = node.data('layer');
      if (activeLayerIds.includes(layer)) {
        node.style('display', 'element');
      } else {
        node.style('display', 'none');
      }
    });

    // Ocultar edges donde ambos extremos están ocultos
    _cy.edges().forEach(edge => {
      const srcVisible = edge.source().style('display') !== 'none';
      const tgtVisible = edge.target().style('display') !== 'none';
      edge.style('display', srcVisible && tgtVisible ? 'element' : 'none');
    });
  }

  /**
   * Filtrar nodos por tipos activos.
   */
  function filterByTypes(activeTypes) {
    if (!_cy) return;

    _cy.nodes().forEach(node => {
      const type = node.data('type');
      if (activeTypes.length === 0 || activeTypes.includes(type)) {
        node.style('display', 'element');
      } else {
        node.style('display', 'none');
      }
    });

    // Ocultar edges
    _cy.edges().forEach(edge => {
      const srcVisible = edge.source().style('display') !== 'none';
      const tgtVisible = edge.target().style('display') !== 'none';
      edge.style('display', srcVisible && tgtVisible ? 'element' : 'none');
    });
  }

  /**
   * Hacer zoom a un nodo.
   */
  function focusNode(nodeId) {
    if (!_cy) return;
    const node = _cy.getElementById(nodeId);
    if (node && !node.empty()) {
      _cy.animate({
        center: { eles: node },
        zoom: 1.8,
      }, {
        duration: 500,
        easing: 'ease-in-out-cubic',
      });
    }
  }

  /**
   * Zoom in.
   */
  function zoomIn() {
    if (!_cy) return;
    _cy.animate({
      zoom: { level: _cy.zoom() * 1.3, renderedPosition: { x: _cy.width() / 2, y: _cy.height() / 2 } },
    }, { duration: 200 });
  }

  /**
   * Zoom out.
   */
  function zoomOut() {
    if (!_cy) return;
    _cy.animate({
      zoom: { level: _cy.zoom() / 1.3, renderedPosition: { x: _cy.width() / 2, y: _cy.height() / 2 } },
    }, { duration: 200 });
  }

  /**
   * Ajustar vista a todos los elementos.
   */
  function fit() {
    if (!_cy) return;
    _cy.animate({
      fit: { eles: _cy.elements(':visible'), padding: 50 },
    }, { duration: 400 });
  }

  /**
   * Registrar handler de eventos.
   */
  function on(event, selector, handler) {
    if (!_cy) return;
    if (typeof selector === 'function') {
      _cy.on(event, selector);
    } else {
      _cy.on(event, selector, handler);
    }
  }

  /**
   * Obtener instancia de Cytoscape.
   */
  function getCy() {
    return _cy;
  }

  /**
   * Mostrar todos los nodos.
   */
  function showAll() {
    if (!_cy) return;
    _cy.elements().style('display', 'element');
    clearHighlight();
  }

  /**
   * Re-layout.
   */
  function relayout() {
    _applyLayout();
  }

  return {
    init,
    loadFromManifest,
    highlightNode,
    clearHighlight,
    highlightSearchResults,
    filterByLayers,
    filterByTypes,
    focusNode,
    zoomIn,
    zoomOut,
    fit,
    on,
    getCy,
    showAll,
    relayout,
  };
})();
