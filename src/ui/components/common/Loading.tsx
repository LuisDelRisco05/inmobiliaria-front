
interface LoadingProps {
  type?: "spinner" | "dots" | "ring";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  color?: "primary" | "secondary" | "accent" | "neutral" | "info" | "success" | "warning" | "error";
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  type = "spinner",
  size = "md",
  color = "primary",
  fullScreen = false,
}) => {
  const typeClass =
    type === "spinner"
      ? "loading-spinner"
      : type === "dots"
      ? "loading-dots"
      : "loading-ring";

  const containerClass = fullScreen
    ? "flex justify-center items-center h-screen w-full"
    : "flex justify-center items-center";

  return (
    <div className={containerClass}>
      <span className={`loading ${typeClass} loading-${size} text-${color}`}></span>
    </div>
  );
};

export default Loading;
