import { AppLayout } from './app-layout';
import { AppRoutes } from './app-routes';
import { SolanaProvider } from './solana-provider';

export function App() {
  return (
    <SolanaProvider>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </SolanaProvider>
  );
}
