import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

function formatLabel(value: number) {
  if (value >= 1000000) return `${value / 1000000}m`;
  if (value >= 1000) return `${value / 1000}k`;
  return value.toString();
}

const steps = [
  1, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000,
  10000000,
];

interface RangeSliderProps {
  min: number; // Current min value
  max: number; // Current max value
  onChange: (values: { min: number; max: number }) => void; // Callback to update min and max
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, onChange }) => {
  const sortedSteps = useMemo(() => [...steps].sort((a, b) => a - b), [steps]);

  const stepToIndex = useMemo(() => {
    const indexMap = new Map<number, number>();
    sortedSteps.forEach((step, index) => {
      indexMap.set(step, index);
    });
    return indexMap;
  }, [sortedSteps]);

  const indexToStep = useMemo(() => {
    return sortedSteps;
  }, [sortedSteps]);

  const findClosestStep = useCallback(
    (value: number) => {
      return sortedSteps.reduce((prev, curr) => {
        return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
      });
    },
    [sortedSteps]
  );

  const [minVal, setMinVal] = useState(() => findClosestStep(min));
  const [maxVal, setMaxVal] = useState(() => findClosestStep(max));

  const sliderRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const getPercent = useCallback(
    (value: number) => {
      const index = stepToIndex.get(value) || 0;
      return (index / (sortedSteps.length - 1)) * 100;
    },
    [stepToIndex, sortedSteps]
  );

  const handleMouseDown = (thumb: "min" | "max") => {
    setDragging(thumb);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging || !sliderRef.current) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const rect = sliderRef.current.getBoundingClientRect();
      const rawPercent = (clientX - rect.left) / rect.width;
      const index = Math.round(rawPercent * (sortedSteps.length - 1));
      const targetValue =
        indexToStep[Math.max(0, Math.min(index, sortedSteps.length - 1))];

      if (dragging === "min") {
        const targetIndex = stepToIndex.get(targetValue)!;
        const currentMaxIndex = stepToIndex.get(maxVal)!;

        let adjustedIndex = targetIndex;
        if (adjustedIndex >= currentMaxIndex) {
          adjustedIndex = currentMaxIndex - 1;
        }
        adjustedIndex = Math.max(adjustedIndex, 0);

        const adjustedMin = indexToStep[adjustedIndex];
        setMinVal(adjustedMin);
        onChange({ min: adjustedMin, max: maxVal });
      } else {
        const targetIndex = stepToIndex.get(targetValue)!;
        const currentMinIndex = stepToIndex.get(minVal)!;

        let adjustedIndex = targetIndex;
        if (adjustedIndex <= currentMinIndex) {
          adjustedIndex = currentMinIndex + 1;
        }
        adjustedIndex = Math.min(adjustedIndex, sortedSteps.length - 1);

        const adjustedMax = indexToStep[adjustedIndex];
        setMaxVal(adjustedMax);
        onChange({ min: minVal, max: adjustedMax });
      }
    },
    [dragging, maxVal, minVal, indexToStep, onChange, sortedSteps, stepToIndex]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const minPercent = getPercent(minVal);
  const maxPercent = getPercent(maxVal);

  return (
    <div className="relative h-2 mx-6 my-4 select-none">
      {/* Slider track */}
      <div
        ref={sliderRef}
        className="absolute h-1 w-full bg-gray-300 rounded-full top-1/2 -translate-y-1/2"
      >
        <div
          className="absolute h-full bg-blue-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>

      {/* Min Thumb */}
      <div
        className="absolute z-10"
        style={{
          left: `${minPercent}%`,
          transform: "translate(-50%, -50%)",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleMouseDown("min");
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          handleMouseDown("min");
        }}
      >
        <div className="text-center mb-2 text-sm text-black">
          {formatLabel(minVal)}
        </div>
        <div className="w-5 h-5 bg-blue-500 rounded-full mb-5 cursor-pointer shadow-lg hover:scale-110 transition-transform" />
      </div>

      {/* Max Thumb */}
      <div
        className="absolute z-10"
        style={{
          left: `${maxPercent}%`,
          transform: "translate(-50%, -50%)",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleMouseDown("max");
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          handleMouseDown("max");
        }}
      >
        <div className="text-center mb-2 text-sm text-black">
          {formatLabel(maxVal)}
        </div>
        <div className="w-5 h-5 bg-blue-500 rounded-full mb-5 cursor-pointer shadow-lg hover:scale-110 transition-transform" />
      </div>
    </div>
  );
};

export default RangeSlider;
