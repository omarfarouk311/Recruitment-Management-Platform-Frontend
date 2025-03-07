import Button from "../common/Button";
interface TabGroupProps {
  tabs: string[];
  activeTab: number;
  loadingTab: number | null;
  onTabChange: (index: number) => void;
}

const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  activeTab,
  loadingTab,
  onTabChange,
}) => {
  const handleClick = (index: number) => {
    if (index === activeTab || loadingTab !== null) return;
    onTabChange(index);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-2 mt-10 mb-3 border-2 border-gray-200">
      <div className="flex justify-center gap-4">
        {tabs.map((tab, index) => (
          <div key={tab} className="flex-1" style={{ minWidth: "100px" }}>
            <Button
              variant={index === activeTab ? "currentTab" : "outline"}
              loading={loadingTab === index}
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
