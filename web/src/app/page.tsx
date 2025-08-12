import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5">
      <Button variant="primary" size="xs">
        default
      </Button>
      <Button variant="secondary">secondary</Button>
      <Button variant="destructive">destructive</Button>
      <Button variant="ghost">ghost</Button>

      <Button variant="outline">outline</Button>
      <Button variant="muted">muted</Button>
      <Button variant="teritary">teritrary</Button>
      <Input />
    </div>
  );
}
