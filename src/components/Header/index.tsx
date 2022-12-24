import { useNavigation } from "@react-navigation/native";
import { Container, Logo, BackIcon, BackButton } from "./styles";

import logo from "@assets/logo.png";

type HeaderProps = {
  showBackButton?: boolean;
};

export const Header = ({ showBackButton = false }: HeaderProps) => {
  const { navigate } = useNavigation();

  const handleGoHome = () => {
    navigate("groups");
  };

  return (
    <Container>
      {showBackButton && (
        <BackButton onPress={handleGoHome}>
          <BackIcon />
        </BackButton>
      )}

      <Logo source={logo} />
    </Container>
  );
};
