import Button from "../common/Button";
import { useState } from "react";

interface TabGroupProps {
  tabs: string[];
}

const TabGroup: React.FC<TabGroupProps> = ({ tabs }) => {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [tabStatus, setTabStatus] = useState<("currentTab" | "outline")[]>(
    tabs.map((_, index) => (index === 0 ? "currentTab" : "outline"))
  );

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
    <div className="bg-white rounded-3xl shadow-sm p-2 mt-10 mb-3 border-2 border-gray-200">
      {/* White rounded container */}
      <div className="flex justify-center gap-4">
        {tabs.map((tab, index) => (
          <div
            key={tab}
            className="flex-1"
            style={{ minWidth: "100px" }} // Set a minimum width for the tabs
          >
            <Button
              variant={tabStatus[index]}
              loading={loadingIndex === index}
              onClick={() => handleClick(index)}
              className="text-sm w-full"
            >
              {tab}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabGroup;
