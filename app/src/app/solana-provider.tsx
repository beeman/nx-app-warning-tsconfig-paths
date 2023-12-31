import { WalletError } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-unsafe-burner';
import { Cluster, clusterApiUrl } from '@solana/web3.js';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

export interface SolanaProviderContext {
  cluster: Cluster;
  endpoint: string;
  setCluster?: (cluster: Cluster) => void;
}

const Context = createContext<SolanaProviderContext>(
  {} as SolanaProviderContext
);

export function SolanaProvider({ children }: { children: ReactNode }) {
  const [cluster, setCluster] = useState<Cluster>('devnet');
  const endpoint = useMemo(() => clusterApiUrl(cluster), [cluster]);
  const wallets = useMemo(
    () => [new UnsafeBurnerWalletAdapter(), new SolflareWalletAdapter()],
    [cluster]
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  const value: SolanaProviderContext = {
    cluster,
    endpoint,
    setCluster,
  };
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <WalletModalProvider>
          <Context.Provider value={value}>{children}</Context.Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export function useSolana() {
  return useContext(Context);
}
