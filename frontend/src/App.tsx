import { Button } from "./components/ui/button";
import { Progress } from "@/components/ui/progress"


function App() {
  return (
    <div>
      <Button>Click me</Button>
      <Progress value={33} />
    </div>
    
  );
}

export default App;
