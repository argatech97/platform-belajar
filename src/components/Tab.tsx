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
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        scrollbarWidth: "thin", // Firefox
        msOverflowStyle: "none", // IE/Edge
        flexShrink: 0,
      }}
    >
      {tabList.map((tab, index) => (
        <div
          onClick={() => tabOnClick(tab.value)}
          key={index}
          style={{
            cursor: "pointer",
            backgroundColor:
              activeTab === tab.value ? (primaryColor ? primaryColor : "#69CA87") : "white",
            flex: "1 0 auto", // biar tidak stretch
            whiteSpace: "nowrap",
            minWidth: "100px",
            padding: "12px 20px",
            textAlign: "center",
            color: activeTab === tab.value ? "white" : "black",
            borderBottom: activeTab === tab.value ? "3px solid #333" : "3px solid transparent",
            transition: "all 0.3s ease",
          }}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
