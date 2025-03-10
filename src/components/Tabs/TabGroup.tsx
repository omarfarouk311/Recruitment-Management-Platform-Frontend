import Button from "../common/Button";

interface TabGroupProps {
  tabs: string[];
  useActiveTab: () => number | null;
  useLoadingTab: () => number | null;
  useSetActiveTab: () => (tab: number) => void;
}

const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  useActiveTab,
  useLoadingTab,
  useSetActiveTab,
}) => {
  const activeTab = useActiveTab();
  const loadingTab = useLoadingTab();
  const setActiveTab = useSetActiveTab();

  return (
    <div className="bg-white rounded-3xl shadow-sm p-2 mt-10 mb-3 border-2 border-gray-200">
      <div className="flex justify-center gap-4">
        {tabs.map((tab, index) => (
          <div key={tab} className="flex-1" style={{ minWidth: "100px" }}>
            <Button
              variant={index === activeTab ? "currentTab" : "outline"}
              loading={loadingTab === index}
              disabled={loadingTab !== null}
              onClick={() => setActiveTab(index)}
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
