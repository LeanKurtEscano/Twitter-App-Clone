import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TabsProps {
  activeTab: "posts" | "latest" | "user";
  setActiveTab: (tab: "posts" | "latest" | "user") => void;
}

const SearchTabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "posts", label: "Top" },
    { key: "latest", label: "Latest" },
    { key: "user", label: "People" },
  ];

  return (
    <View className="border-b border-gray-200">
      <View className="flex-row">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className="flex-1 items-center py-3"
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab.key as "posts" | "latest" | "user")}
          >
            <Text
              className={`text-base ${
                activeTab === tab.key ? "text-sky-500 font-semibold" : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SearchTabs;