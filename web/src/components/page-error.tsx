import { AlertTriangle } from "lucide-react";

type TPageErrorProps = {
  message: string;
};

export const PageError = ({
  message = "something went wrong",
}: TPageErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle className="size-6 items-center justify-center mb-2" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
};
