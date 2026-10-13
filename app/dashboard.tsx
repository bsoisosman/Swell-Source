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
    <View className="flex-1 bg-surface">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 60 }}
      >
        <Text className="text-display font-bold text-content">
          Swell
        </Text>

        <Text className="mt-2 text-body text-content-muted">
          Understand the water around you.
        </Text>

        <View className="mt-6">
          <SearchBar value={search} onChangeText={setSearch} />
        </View>

        <Pressable
          onPress={() => router.push("/map")}
          className="mt-4 items-center rounded-control bg-accent p-4"
        >
          <Text className="font-semibold text-content-on-accent">
            Open Interactive Map
          </Text>
        </Pressable>

        <Text className="mb-3 mt-8 text-heading font-bold text-content">
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
          className="mt-6 rounded-card bg-surface-raised p-4"
        >
          <Text className="text-center font-semibold text-content-on-raised">
            Settings
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
