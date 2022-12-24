import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppError } from "@utils/AppError";

import { GROUP_COLLECTION } from "@storage/storageConfig";
import { getAllGroups } from "./getAllGroups";

export const groupCreate = async (newGroupName: string) => {
  try {
    const storedGroups = await getAllGroups();

    const groupAlreadyExists = storedGroups.includes(newGroupName);

    if (groupAlreadyExists) {
      throw new AppError("Esse grupo já existe!");
    }

    await AsyncStorage.setItem(
      GROUP_COLLECTION,
      JSON.stringify([...storedGroups, newGroupName])
    );
  } catch (error) {
    throw error;
  }
};
