import LeftPanel from "./(home)/left";
import RightPanel from "./(home)/right";

export default function Home() {
  return (
    <div className="bg-background text-txt">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
