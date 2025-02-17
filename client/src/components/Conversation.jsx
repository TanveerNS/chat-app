import { Box, Stack } from "@mui/material";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Message from './Message'

const Conversation = ({ sidebar = { open: true } }) => {
  return <>
    <Box sx={{ height: "100%", width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)", backgroundColor: "#F0F4FA" }}>
      <Stack height={'100%'} maxHeight={'100vh'} width={'auto'}>
        <Header />
        <Box className='scrollbar' width={"100%"} sx={{ flexGrow: 1, height: '100%', overflowY: 'scroll' }}>
          <Message menu={true} />
        </Box>
        <Footer />
      </Stack>
    </Box>
  </>;
};

export default Conversation;
