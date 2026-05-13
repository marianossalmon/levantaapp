import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Node, Segment, Point } from '../types/survey';

export function useSurveyCanvas() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [scalePixelRatio, setScalePixelRatio] = useState<number | null>(null);

  const addNode = useCallback((point: Point) => {
    const newNode: Node = { id: uuidv4(), ...point };
    
    setNodes(prev => [...prev, newNode]);

    if (selectedNodeId) {
      const newSegment: Segment = {
        id: uuidv4(),
        startNodeId: selectedNodeId,
        endNodeId: newNode.id,
        lengthCm: null,
        isReference: false,
      };
      setSegments(prev => [...prev, newSegment]);
    }

    setSelectedNodeId(newNode.id);
  }, [selectedNodeId]);

  const updateSegmentLength = useCallback((segmentId: string, lengthCm: number) => {
    setSegments(prev => prev.map(seg => {
      if (seg.id === segmentId) {
        return { ...seg, lengthCm };
      }
      return seg;
    }));
  }, []);

  const selectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return {
    nodes,
    segments,
    selectedNodeId,
    scalePixelRatio,
    setScalePixelRatio,
    addNode,
    updateSegmentLength,
    selectNode,
    clearSelection,
    setNodes,
    setSegments
  };
}
