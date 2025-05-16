import '../../bookstore/src/css/App.css';
import { ConfigProvider, theme } from 'antd';
import AppRouter from './components/router';

function App() {
  const themeToken = {
    colorPrimary: "#FF3333",
    colorInfo: "#FF3333"
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: themeToken
      }}
    >
      <AppRouter />

    </ConfigProvider>
  );
}

export default App;
