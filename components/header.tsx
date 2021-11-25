import { Box, Button } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

interface Props {}

function Header(props: Props): JSX.Element {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <Box as="header">
      {!session ? (
        <Button onClick={() => signIn(undefined, { callbackUrl: "http://localhost:3000/game" })}>
          Login
        </Button>
      ) : (
        <Button onClick={() => signOut()}>Logout</Button>
      )}
    </Box>
  );
}

export default Header;
