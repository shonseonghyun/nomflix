import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './style/GlobalStyle';
import { theme } from './style/theme/theme';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';

const client = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <QueryClientProvider client={client}>
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </QueryClientProvider>
);
