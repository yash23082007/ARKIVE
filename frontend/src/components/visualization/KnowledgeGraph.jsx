import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { audio } from '../../utils/audio';

export default function KnowledgeGraph({ nodes, edges, onNodeClick }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!nodes || !edges || nodes.length === 0) return;
    
    const width = 800;
    const height = 500;
    
    // Copy node and link arrays to prevent D3 from mutating read-only props
    const d3Nodes = nodes.map(n => ({ ...n }));
    const d3Edges = edges.map(e => ({
      ...e,
      source: d3Nodes.find(n => n.id === (e.source.id || e.source)),
      target: d3Nodes.find(n => n.id === (e.target.id || e.target))
    })).filter(e => e.source && e.target);

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');
    
    svg.selectAll('*').remove();

    // Define Arrow markers for directed edges
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#4f8ef7')
      .style('stroke','none');

    const simulation = d3.forceSimulation(d3Nodes)
      .force('link', d3.forceLink(d3Edges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw edges
    const link = svg.append('g')
      .selectAll('line')
      .data(d3Edges)
      .join('line')
      .attr('stroke', '#4f8ef7')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrowhead)');

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(d3Nodes)
      .join('circle')
      .attr('r', d => 8 + (d.importance || 0) * 0.8)
      .attr('fill', d => d.layer === 0 ? '#43d9ad' : '#7b5ea7')
      .attr('stroke', '#0a0a0f')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Node interactions
    node.on('mouseover', function() {
      d3.select(this)
        .transition()
        .duration(150)
        .attr('stroke', '#4f8ef7')
        .attr('stroke-width', 3);
    }).on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(150)
        .attr('stroke', '#0a0a0f')
        .attr('stroke-width', 1.5);
    }).on('click', (event, d) => {
      audio.playClick();
      if (onNodeClick) onNodeClick(d);
    });

    // Labels
    const labels = svg.append('g')
      .selectAll('text')
      .data(d3Nodes)
      .join('text')
      .text(d => d.label)
      .attr('font-size', 10)
      .attr('font-family', 'monospace')
      .attr('fill', '#8892a4')
      .attr('dx', 12)
      .attr('dy', 4)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        audio.playClick();
        if (onNodeClick) onNodeClick(d);
      });

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('cx', d => d.x).attr('cy', d => d.y);
      labels.attr('x', d => d.x).attr('y', d => d.y);
    });

    return () => simulation.stop();
  }, [nodes, edges]);

  return (
    <div className="bg-cosmos border border-aurora rounded-xl p-4 overflow-hidden relative min-h-[350px] flex items-center justify-center">
      <div className="absolute top-2 left-3 text-[10px] text-signal font-mono uppercase tracking-widest pointer-events-none select-none">
        D3 Concept Topology Map
      </div>
      <svg ref={svgRef} className="w-full h-full block" />
    </div>
  );
}
