import { Button, Container, Flex, Text, VStack } from "@chakra-ui/react";
import { Link, redirect } from "react-router-dom";

const NotFound = () => {
  return (
    <Container maxW="container.xl">
      <Flex h="100vh" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Text>Lost your way?</Text>
          <Text>We can't find the page you're looking for</Text>
          <Link to="/">
            <Button colorScheme="blue">Take me home</Button>
          </Link>
        </VStack>
      </Flex>
    </Container>
  );
};

export default NotFound;
