import { View, TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <View className="rounded-2xl bg-white px-4 py-1 shadow-sm">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search a city or address..."
        placeholderTextColor="#888"
        className="h-12 text-base text-gray-900"
      />
    </View>
  );
}
