interface progressProps {
  progress: number;
}
const StepProgress = ({ progress }: progressProps) => {
  return (
    <div>
      <div
        className="h-1 bg-linear-to-r from-purple-500/85 to-purple-700 transition-all rounded"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default StepProgress;
