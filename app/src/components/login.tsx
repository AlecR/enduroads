import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Container,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { isAuthenticated, storeAuthToken } from "../util/auth_utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  const handleSignInButtonClick = () => {
    setIsLoggingIn(true);
    login(email, password)
      .then((token) => {
        storeAuthToken(token);
        navigate("/dashboard");
      })
      .catch((err) => {
        setLoginError(err.message);
      });
    setIsLoggingIn(false);
  };

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Container bg={"gray.50"} minHeight="100vh" minWidth="100%">
      <Flex minHeight="100vh" align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          </Stack>
          <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <FormControl id="email" isInvalid={!!loginError}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setLoginError(null);
                    setEmail(e.target.value);
                  }}
                  isInvalid={!!loginError}
                />
                <FormErrorMessage>{loginError}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={!!loginError}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setLoginError(null);
                    setPassword(e.target.value);
                  }}
                  isInvalid={!!loginError}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link color={"blue.400"}>Forgot password?</Link>
                </Stack>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={handleSignInButtonClick}
                  isLoading={isLoggingIn}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Container>
  );
};

export default Login;
