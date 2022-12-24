import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { getPlayersByGroup } from "./getPlayersByGroup";

export const removePlayerByGroup = async (
  playerName: string,
  group: string
) => {
  try {
    const storage = await getPlayersByGroup(group);

    const filteredPlayers = storage.filter(
      (player) => player.name !== playerName
    );
    await AsyncStorage.setItem(
      `${PLAYER_COLLECTION}-${group}`,
      JSON.stringify(filteredPlayers)
    );
  } catch (error) {
    throw error;
  }
};
