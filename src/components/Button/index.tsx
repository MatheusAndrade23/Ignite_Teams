import { TouchableOpacityProps } from "react-native";

import { Container, ButtonTypeStyleProps, Title } from "./styles";

type ButtonProps = TouchableOpacityProps & {
  title: string;
  type?: ButtonTypeStyleProps;
};

export const Button = ({ title, type = "PRIMARY", ...rest }: ButtonProps) => {
  return (
    <Container {...rest} type={type}>
      <Title>{title}</Title>
    </Container>
  );
};
