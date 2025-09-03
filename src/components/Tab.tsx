import React, { useCallback, useState } from "react";

interface ITabItem {
  label: string;
  value: string;
}
interface ITab {
  primaryColor?: string;
  tabList: ITabItem[];
  initialActiveTab: string;
  tabOnChange: (value: string) => void;
}

export default function Tab({ primaryColor, tabList, tabOnChange, initialActiveTab }: ITab) {
  const [activeTab, setActiveTab] = useState<string>(initialActiveTab);

  const tabOnClick = useCallback(
    (value: string) => {
      tabOnChange(value);
      setActiveTab(value);
    },
    [tabOnChange]
  );

  return (
    <div style={{ display: "flex", flexWrap: "nowrap", overflow: "auto" }}>
      {tabList.map((tab, index) => (
        <div
          onClick={() => tabOnClick(tab.value)}
          key={index}
          style={{
            backgroundColor:
              activeTab === tab.value ? (primaryColor ? primaryColor : "#69CA87") : "white",
            flexGrow: 1,
            minWidth: "100px",
            padding: "20px",
            textAlign: "center",
            color: activeTab === tab.value ? "white" : "black",
          }}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
