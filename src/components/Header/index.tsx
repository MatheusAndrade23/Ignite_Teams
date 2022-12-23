import { Container, Logo, BackIcon, BackButton } from "./styles";

import logo from "@assets/logo.png";

type HeaderProps = {
  showBackButton?: boolean;
};

export const Header = ({ showBackButton = false }: HeaderProps) => {
  return (
    <Container>
      {showBackButton && (
        <BackButton>
          <BackIcon />
        </BackButton>
      )}

      <Logo source={logo} />
    </Container>
  );
};
