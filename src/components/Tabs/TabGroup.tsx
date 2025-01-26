import Button from "../common/Button";
import { useState } from "react";

const TabGroup = () => {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [tabStatus, setTabStatus] = useState<("currentTab" | "outline")[]>([
    "currentTab",
    "outline",
  ]);

  const handleClick = async (index: number) => {
    // Prevent action if clicking active tab or during loading
    if (tabStatus[index] === "currentTab" || loadingIndex !== null) return;

    setLoadingIndex(index);

    setTimeout(() => {
      setTabStatus((prevStatus) =>
        prevStatus.map((_, i) => (i === index ? "currentTab" : "outline"))
      );
      setLoadingIndex(null);
    }, 1500);
  };

  return (
    <div className="flex justify-center space-x-6 my-6">
      <Button
        variant={tabStatus[0]}
        loading={loadingIndex === 0}
        onClick={() => handleClick(0)}
        className="text-sm"
      >
        For You
      </Button>
      <Button
        variant={tabStatus[1]}
        loading={loadingIndex === 1}
        onClick={() => handleClick(1)}
        className="text-sm"
      >
        Companies
      </Button>
    </div>
  );
};

export default TabGroup;
