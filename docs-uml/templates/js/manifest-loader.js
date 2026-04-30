/**
 * manifest-loader.js — Carga y parseo del manifiesto de arquitectura.
 * 
 * Carga data/manifest.json y expone funciones de consulta para
 * nodos, capas, relaciones y diagramas.
 */

const ManifestLoader = (() => {
  let _manifest = null;
  let _loaded = false;

  // Índices para búsqueda rápida
  let _nodesById = {};
  let _layersById = {};
  let _diagramsById = {};

  /**
   * Cargar el manifiesto desde el path especificado.
   */
  async function load(path = 'data/manifest.json') {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      _manifest = await response.json();
      _buildIndices();
      _loaded = true;
      return _manifest;
    } catch (err) {
      console.error('[ManifestLoader] Error cargando manifiesto:', err);
      _loaded = false;
      return null;
    }
  }

  /**
   * Construir índices de búsqueda rápida.
   */
  function _buildIndices() {
    _nodesById = {};
    _layersById = {};
    _diagramsById = {};

    for (const layer of _manifest.layers || []) {
      _layersById[layer.id] = layer;
    }
    for (const node of _manifest.nodes || []) {
      _nodesById[node.id] = node;
    }
    for (const diagram of _manifest.diagrams || []) {
      _diagramsById[diagram.id] = diagram;
    }
  }

  /**
   * Estado de carga.
   */
  function isLoaded() {
    return _loaded;
  }

  /**
   * Obtener el manifiesto completo.
   */
  function getManifest() {
    return _manifest;
  }

  /**
   * Obtener metadatos del proyecto.
   */
  function getProject() {
    return _manifest?.project || {};
  }

  /**
   * Obtener todas las capas.
   */
  function getLayers() {
    return _manifest?.layers || [];
  }

  /**
   * Obtener una capa por ID.
   */
  function getLayer(id) {
    return _layersById[id] || null;
  }

  /**
   * Obtener todos los nodos.
   */
  function getNodes() {
    return _manifest?.nodes || [];
  }

  /**
   * Obtener un nodo por ID.
   */
  function getNode(id) {
    return _nodesById[id] || null;
  }

  /**
   * Obtener nodos filtrados por capa.
   */
  function getNodesByLayer(layerId) {
    return getNodes().filter(n => n.layer === layerId);
  }

  /**
   * Obtener nodos filtrados por tipo.
   */
  function getNodesByType(type) {
    return getNodes().filter(n => n.type === type);
  }

  /**
   * Obtener tipos únicos de nodos.
   */
  function getNodeTypes() {
    const types = new Set(getNodes().map(n => n.type).filter(Boolean));
    return [...types].sort();
  }

  /**
   * Obtener todas las relaciones.
   */
  function getRelations() {
    return _manifest?.relations || [];
  }

  /**
   * Obtener relaciones de un nodo (entrantes y salientes).
   */
  function getRelationsForNode(nodeId) {
    return getRelations().filter(r => r.from === nodeId || r.to === nodeId);
  }

  /**
   * Obtener relaciones salientes de un nodo.
   */
  function getOutgoingRelations(nodeId) {
    return getRelations().filter(r => r.from === nodeId);
  }

  /**
   * Obtener relaciones entrantes a un nodo.
   */
  function getIncomingRelations(nodeId) {
    return getRelations().filter(r => r.to === nodeId);
  }

  /**
   * Obtener todos los diagramas.
   */
  function getDiagrams() {
    return (_manifest?.diagrams || []).sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  /**
   * Obtener un diagrama por ID.
   */
  function getDiagram(id) {
    return _diagramsById[id] || null;
  }

  /**
   * Obtener diagramas relacionados con un nodo.
   */
  function getDiagramsForNode(nodeId) {
    const node = getNode(nodeId);
    if (!node?.diagrams) return [];
    return node.diagrams.map(id => getDiagram(id)).filter(Boolean);
  }

  /**
   * Búsqueda textual en nodos, capas y diagramas.
   */
  function search(query) {
    if (!query || !_manifest) return { nodes: [], diagrams: [], layers: [] };

    const q = query.toLowerCase().trim();
    if (q.length < 2) return { nodes: [], diagrams: [], layers: [] };

    const matchNodes = getNodes().filter(n =>
      n.name.toLowerCase().includes(q) ||
      (n.description || '').toLowerCase().includes(q) ||
      (n.tags || []).some(t => t.toLowerCase().includes(q)) ||
      n.id.toLowerCase().includes(q)
    );

    const matchDiagrams = getDiagrams().filter(d =>
      d.title.toLowerCase().includes(q) ||
      (d.description || '').toLowerCase().includes(q) ||
      d.id.toLowerCase().includes(q) ||
      (d.type || '').toLowerCase().includes(q)
    );

    const matchLayers = getLayers().filter(l =>
      l.name.toLowerCase().includes(q) ||
      (l.description || '').toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q)
    );

    return {
      nodes: matchNodes,
      diagrams: matchDiagrams,
      layers: matchLayers,
    };
  }

  /**
   * Obtener estadísticas del manifiesto.
   */
  function getStats() {
    return {
      layers: getLayers().length,
      nodes: getNodes().length,
      relations: getRelations().length,
      diagrams: getDiagrams().length,
      nodeTypes: getNodeTypes().length,
    };
  }

  /**
   * Contar nodos por capa.
   */
  function countNodesByLayer() {
    const counts = {};
    for (const layer of getLayers()) {
      counts[layer.id] = 0;
    }
    for (const node of getNodes()) {
      if (counts[node.layer] !== undefined) {
        counts[node.layer]++;
      }
    }
    return counts;
  }

  return {
    load,
    isLoaded,
    getManifest,
    getProject,
    getLayers,
    getLayer,
    getNodes,
    getNode,
    getNodesByLayer,
    getNodesByType,
    getNodeTypes,
    getRelations,
    getRelationsForNode,
    getOutgoingRelations,
    getIncomingRelations,
    getDiagrams,
    getDiagram,
    getDiagramsForNode,
    search,
    getStats,
    countNodesByLayer,
  };
})();
