import { StakingDashboard } from "./components/StakingDashboard";

const CONTRACT_ADDRESS = "0xA8Ac339504973AB21c1206F753C5BAF0350ba08d" as const;

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
