import { StakingDashboard } from "./components/StakingDashboard";

const CONTRACT_ADDRESS = "0x79406FB2c52108ff36C4bB801c0Cd5215Cf40183" as const;

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
