'use client';
import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva';

const BarModelCreator = () => {
  const [barModel, setBarModel] = useState({
    type: 'comparison', // 'comparison' or 'part-whole'
    bars: [
      {
        id: 'bar1',
        label: 'Box A',
        segments: [{ value: 770, label: '770 g' }],
        totalValue: 770,
      },
      {
        id: 'bar2',
        label: 'Box B',
        segments: [{ value: 1, label: '' }],
        totalValue: 0,
      },
      {
        id: 'bar3',
        label: 'Box C',
        segments: [{ value: 220, label: '220 g' }],
        totalValue: 220,
      },
    ],
    bracket: { label: '6450 g', bars: ['bar1', 'bar2', 'bar3'] },
  });

  const [selectedExample, setSelectedExample] = useState('example1');

  const example1 = {
    type: 'comparison',
    bars: [
      {
        id: 'bar1',
        label: 'Box A',
        segments: [{ value: 770, label: '770 g' }],
        totalValue: 770,
      },
      {
        id: 'bar2',
        label: 'Box B',
        segments: [{ value: 1, label: '' }],
        totalValue: 0,
      },
      {
        id: 'bar3',
        label: 'Box C',
        segments: [{ value: 220, label: '220 g' }],
        totalValue: 220,
      },
    ],
    bracket: { label: '6450 g', bars: ['bar1', 'bar2', 'bar3'] },
  };

  const example2 = {
    type: 'part-whole',
    bars: [
      {
        id: 'bar1',
        label: 'Adults',
        segments: [
          { value: 236, label: '236', sublabel: 'Men' },
          { value: 189, label: '?', sublabel: 'Women' },
        ],
        totalValue: 425,
        totalLabel: '425',
      },
    ],
    bracket: null,
  };

  const drawBarModel = (model) => {
    const startX = 100;
    const startY = 80;
    const barHeight = 50;
    const barSpacing = 32;
    const scale = 0.5;

    const elements = [];
    let maxWidth = 0;

    // Calculate total for scaling
    const allValues = model.bars.flatMap((bar) =>
      bar.segments.map((seg) => seg.value)
    );
    const maxValue = Math.max(...allValues.filter((v) => v > 0));

    model.bars.forEach((bar, barIndex) => {
      const y = startY + barIndex * (barHeight + barSpacing);
      let currentX = startX + 80;

      // Draw bar label
      elements.push(
        <Text
          key={`label-${bar.id}`}
          x={startX - 70}
          y={y + barHeight / 2 - 8}
          text={bar.label}
          fontSize={16}
          fill="#dc2626"
          fontStyle="bold"
        />
      );

      // Draw segments
      bar.segments.forEach((segment, segIndex) => {
        const segmentWidth =
          segment.value > 0
            ? (segment.value / maxValue) * 300 * scale + 100
            : 150;

        // Rectangle
        elements.push(
          <Rect
            key={`rect-${bar.id}-${segIndex}`}
            x={currentX}
            y={y}
            width={segmentWidth}
            height={barHeight}
            stroke="#dc2626"
            strokeWidth={2}
            fill="white"
          />
        );

        // Segment label
        if (segment.label) {
          elements.push(
            <Text
              key={`seg-label-${bar.id}-${segIndex}`}
              x={currentX + segmentWidth / 2}
              y={y - 25}
              text={segment.label}
              fontSize={16}
              fill="#dc2626"
              fontStyle="bold"
              align="center"
              offsetX={segment.label.length * 4}
            />
          );

          // Pointer line
          elements.push(
            <Line
              key={`pointer-${bar.id}-${segIndex}`}
              points={[
                currentX + segmentWidth / 2,
                y - 5,
                currentX + segmentWidth / 2,
                y - 18,
              ]}
              stroke="#dc2626"
              strokeWidth={1.5}
              dash={[4, 4]}
            />
          );
        }

        // Sublabel (for part-whole models)
        if (segment.sublabel) {
          elements.push(
            <Text
              key={`sublabel-${bar.id}-${segIndex}`}
              x={currentX + segmentWidth / 2}
              y={y + barHeight / 2 - 8}
              text={segment.sublabel}
              fontSize={14}
              fill="#dc2626"
              align="center"
              offsetX={segment.sublabel.length * 3.5}
            />
          );

          // Bottom value
          elements.push(
            <Text
              key={`bottom-${bar.id}-${segIndex}`}
              x={currentX + segmentWidth / 2}
              y={y + barHeight + 8}
              text={segment.label}
              fontSize={16}
              fill="#dc2626"
              fontStyle="bold"
              align="center"
              offsetX={segment.label.length * 4}
            />
          );

          // Bottom pointer
          elements.push(
            <Line
              key={`bottom-pointer-${bar.id}-${segIndex}`}
              points={[
                currentX + segmentWidth / 2,
                y + barHeight + 5,
                currentX + segmentWidth / 2,
                y + barHeight + 5,
              ]}
              stroke="#dc2626"
              strokeWidth={1.5}
            />
          );
        }

        currentX += segmentWidth;
      });

      // Total label for part-whole
      if (bar.totalLabel) {
        const totalWidth = currentX - (startX + 80);
        elements.push(
          <Text
            key={`total-${bar.id}`}
            x={startX + 80 + totalWidth / 2}
            y={y - 45}
            text={bar.totalLabel}
            fontSize={16}
            fill="#dc2626"
            fontStyle="bold"
            align="center"
            offsetX={bar.totalLabel.length * 4}
          />
        );

        // Total pointer
        elements.push(
          <Line
            key={`total-pointer-${bar.id}`}
            points={[
              startX + 80 + totalWidth / 2,
              y - 25,
              startX + 80 + totalWidth / 2,
              y - 38,
            ]}
            stroke="#dc2626"
            strokeWidth={1.5}
            dash={[4, 4]}
          />
        );
      }

      maxWidth = Math.max(maxWidth, currentX);
    });

    // Draw bracket for comparison models
    if (model.bracket) {
      const bracketX = maxWidth + 20;
      const bracketStartY = startY;
      const bracketEndY =
        startY + (model.bars.length - 1) * (barHeight + barSpacing) + barHeight;
      const bracketHeight = bracketEndY - bracketStartY;
      const midY = (bracketStartY + bracketEndY) / 2;

      // Curly bracket with sharp tip in middle
      elements.push(
        <Line
          key="bracket"
          points={[
            bracketX,
            bracketStartY, // Top point
            bracketX + 8,
            bracketStartY + 10, // Top curve out
            bracketX + 8,
            midY - 12, // Upper section (closer to tip)
            bracketX + 16,
            midY, // Middle tip (sharper, extends more)
            bracketX + 8,
            midY + 12, // Lower section (closer to tip)
            bracketX + 8,
            bracketEndY - 10, // Bottom curve out
            bracketX,
            bracketEndY, // Bottom point
          ]}
          stroke="#dc2626"
          strokeWidth={2}
          tension={0.2}
          bezier
        />
      );

      // Bracket label
      elements.push(
        <Text
          key="bracket-label"
          x={bracketX + 25}
          y={bracketStartY + bracketHeight / 2 - 8}
          text={model.bracket.label}
          fontSize={16}
          fill="#dc2626"
          fontStyle="bold"
        />
      );
    }

    return elements;
  };

  const loadExample = (example) => {
    setBarModel(example === 'example1' ? example1 : example2);
    setSelectedExample(example);
  };

  const exportJSON = () => {
    return JSON.stringify(barModel, null, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-800">
          Bar Model Creator
        </h1>
        <p className="mb-6 text-gray-600">
          Interactive visual representation for math problems
        </p>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => loadExample('example1')}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                selectedExample === 'example1'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Example 1: Comparison Model
            </button>
            <button
              onClick={() => loadExample('example2')}
              className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                selectedExample === 'example2'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Example 2: Part-Whole Model
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border-2 border-gray-200 bg-white">
            <Stage width={800} height={400}>
              <Layer>{drawBarModel(barModel)}</Layer>
            </Stage>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-3 text-xl font-bold text-gray-800">
            Data Structure (JSON)
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            This structure can be sent to AI for visualization or storage:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
            {exportJSON()}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(exportJSON())}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Copy JSON to Clipboard
          </button>
        </div>

        <div className="mt-6 rounded border-l-4 border-blue-500 bg-blue-50 p-4">
          <h3 className="mb-2 font-bold text-blue-900">
            Data Structure Explanation:
          </h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>
              <strong>type:</strong> 'comparison' or 'part-whole' determines the
              model style
            </li>
            <li>
              <strong>bars:</strong> Array of bar objects with labels and
              segments
            </li>
            <li>
              <strong>segments:</strong> Individual parts within each bar with
              values and labels
            </li>
            <li>
              <strong>bracket:</strong> Optional grouping indicator for
              comparison models
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BarModelCreator;
