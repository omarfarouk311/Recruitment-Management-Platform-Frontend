import { ReactNode } from "react";

interface FilterBarProps {
  children: ReactNode;
}

const FilterBar = ({ children }: FilterBarProps) => {
  return (
    <div className="flex items-center space-x-6 flex-nowrap">{children}</div>
  );
};

export default FilterBar;
