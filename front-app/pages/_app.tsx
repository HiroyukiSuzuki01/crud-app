import { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { store } from "../store/store";
import Navigation from "../components/UI/Navigation";
import Box from "@mui/material/Box";

import Guard from "../components/Gurd/guard";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Guard>
        <Navigation />
        <Box sx={{ p: 5 }}>
          <Component {...pageProps} />
        </Box>
      </Guard>
    </Provider>
  );
}

export default MyApp;
