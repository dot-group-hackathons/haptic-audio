import { View } from "react-native";
import SoundPicker from "../components/SoundPicker";
import { useModel } from "../lib/useModel";
import { useSoundSelection } from "../lib/useSoundSelection";

export default function SettingsScreen() {
  const { labels } = useModel();

  const {
    selected,
    toggle,
  } = useSoundSelection(labels);

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      <SoundPicker
        labels={labels}
        selected={selected}
        onToggle={toggle}
      />
    </View>
  );
}