import { useState, useRef, useEffect } from "react";
import { Alert, FlatList, TextInput, Keyboard } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Filter } from "@components/Filter";
import { Loading } from "@components/Loading";
import { ListEmpty } from "@components/ListEmpty";
import { Highlight } from "@components/Highlight";
import { PlayerCard } from "@components/PlayerCard";
import { ButtonIcon } from "@components/ButtonIcon";

import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { addPlayerByGroup } from "@storage/player/addPlayerByGroup";
import { removeGroupByName } from "@storage/group/removeGroupByName";
import { removePlayerByGroup } from "@storage/player/removePlayerByGroup";
import { getPlayersByGroupAndTeam } from "@storage/player/getPlayersByGroupAndTeam";

import { AppError } from "@utils/AppError";

type RouteParams = {
  group: string;
};

export const Players = () => {
  const [team, setTeam] = useState("Time A");
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const { navigate } = useNavigation();

  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  const handleAddPlayer = async () => {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert("Novo Jogador", "Informe o nome do jogador!");
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    };

    try {
      await addPlayerByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();
      // Keyboard.dismiss();

      setNewPlayerName("");
      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Novo Jogador", error.message);
      } else {
        Alert.alert(
          "Novo Jogador",
          "Não foi possível adicionar o novo jogador!"
        );
        console.log(error);
      }
    }
  };

  const fetchPlayersByTeam = async () => {
    try {
      setIsLoading(true);
      const playersByTeam = await getPlayersByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Jogadores", error.message);
      } else {
        Alert.alert("Jogadores", "Não foi possível carregar os jogadores!");
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePlayer = async (playerName: string) => {
    try {
      await removePlayerByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      Alert.alert("Remover Jogador", "Não foi possível remover o jogador!");
      console.log(error);
    }
  };

  const removeGroup = async () => {
    try {
      await removeGroupByName(group);
      navigate("groups");
    } catch (error) {
      Alert.alert("Remover Turma", "Não foi possível remover turma!");
      console.log(error);
    }
  };

  const handleRemoveGroup = async () => {
    Alert.alert("Remover Turma", `Deseja remover a turma ${group}?`, [
      { text: "Sim", onPress: () => removeGroup() },
      { text: "Não", style: "cancel" },
    ]);
  };

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="Adicione a galera e separe os times!"
      />

      <Form>
        <Input
          onSubmitEditing={handleAddPlayer}
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          placeholder="Nome do jogador"
          value={newPlayerName}
          autoCorrect={false}
          returnKeyType="done"
        />

        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handleRemovePlayer(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há pessoas nesse time!" />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}

      <Button
        onPress={handleRemoveGroup}
        title="Remover Turma"
        type="SECONDARY"
      />
    </Container>
  );
};
