import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { GROUP_COLLECTION } from "@storage/storageConfig";
import { PLAYER_COLLECTION } from "@storage/storageConfig";

import { getAllGroups } from "./getAllGroups";

export const removeGroupByName = async (groupDeleted: string) => {
  try {
    const storedGroups = await getAllGroups();
    const groups = storedGroups.filter((group) => group !== groupDeleted);

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups));
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupDeleted}`);
  } catch (error) {
    throw error;
  }
};
