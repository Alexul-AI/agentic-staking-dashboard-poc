import { StakingDashboard } from "./components/StakingDashboard";

const CONTRACT_ADDRESS = "0xbB31245F4842FE90041B378CDac9Fe1c37701067" as const;

function App() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full">
        <StakingDashboard contractAddress={CONTRACT_ADDRESS} />
      </div>
    </main>
  );
}

export default App;
