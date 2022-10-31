import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import Navigation from "../components/UI/Navigation";
import Box from "@mui/material/Box";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Navigation />
      <Box sx={{ p: 5 }}>
        <Component {...pageProps} />
      </Box>
    </Provider>
  );
}

export default MyApp;
