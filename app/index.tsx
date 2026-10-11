import { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import SearchBar from "../components/SearchBar";
import LocationCard from "../components/LocationCard";
import { mockLocations } from "../data/mockLocations";

export default function HomeScreen() {
  const [search, setSearch] = useState("");

  const filtered = mockLocations.filter((location) =>
    `${location.name} ${location.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-[#f4f7f8]">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60 }}
      >
        <Text className="text-4xl font-bold text-[#0c1953]">
          Swell
        </Text>

        <Text className="mt-2 text-base text-gray-500">
          Understand the water around you.
        </Text>

        <View className="mt-6">
          <SearchBar value={search} onChangeText={setSearch} />
        </View>

        <Pressable
          onPress={() => router.push("/map")}
          className="mt-4 items-center rounded-2xl bg-[#0c1953] p-4"
        >
          <Text className="font-semibold text-white">
            Open Interactive Map
          </Text>
        </Pressable>

        <Text className="mb-3 mt-8 text-xl font-bold text-[#0c1953]">
          Locations
        </Text>

        {filtered.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            onPress={() =>
              router.push({
                pathname: "/location",
                params: { id: location.id },
              })
            }
          />
        ))}

        <Pressable
          onPress={() => router.push("/settings")}
          className="mt-6 rounded-2xl bg-white p-4"
        >
          <Text className="text-center font-semibold text-[#0c1953]">
            Settings
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
