import { Alert, FlatList } from "react-native";
import { useState, useCallback } from "react";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Container } from "./styles";

import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Loading } from "@components/Loading";
import { Highlight } from "@components/Highlight";
import { GroupCard } from "@components/GroupCard";
import { ListEmpty } from "@components/ListEmpty";

import { getAllGroups } from "@storage/group/getAllGroups";

export const Groups = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const { navigate } = useNavigation();

  const handleNewGroup = () => {
    navigate("new");
  };

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const data = await getAllGroups();
      setGroups(data);
    } catch (error) {
      Alert.alert("Turmas", "Não foi possível carregar as turmas!");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnGroup = (group: string) => {
    navigate("players", { group });
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <Header />
      <Highlight title="Turmas" subtitle="Jogue com a sua turma!" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <GroupCard title={item} onPress={() => handleOnGroup(item)} />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty message="Que tal cadastrar a primeira turma?" />
          )}
        />
      )}

      <Button title="Criar nova Turma" onPress={handleNewGroup} />
    </Container>
  );
};
