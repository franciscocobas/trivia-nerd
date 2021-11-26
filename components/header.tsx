import { Box, Button } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

interface Props {}

function Header(props: Props): JSX.Element {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <Box as="header" display="flex" justifyContent="flex-end">
      {!session ? (
        <Button
          m="4"
          onClick={() =>
            signIn(undefined, { callbackUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/game` })
          }
        >
          Sign In
        </Button>
      ) : (
        <Button m="4" onClick={() => signOut()}>
          Sign Out
        </Button>
      )}
    </Box>
  );
}

export default Header;
