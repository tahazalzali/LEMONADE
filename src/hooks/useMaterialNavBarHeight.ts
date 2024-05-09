
import { useSafeAreaInsets } from "react-native-safe-area-context";

const useMaterialBarHeight = (withoutBottomTabs: boolean) => {
  const { bottom, top } = useSafeAreaInsets();

  return bottom - Math.floor(top) + (withoutBottomTabs ? 24 : 80);
};

export default useMaterialBarHeight;
