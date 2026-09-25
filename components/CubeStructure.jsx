export default function CubeStructure() {
  return <div className="cube-structure" aria-hidden="true">
    <div className="cube-halo" />
    <div className="cube-orbit cube-orbit-one"><span /></div>
    <div className="cube-orbit cube-orbit-two"><span /></div>
    <div className="cube-scene">
      <div className="cube cube-large">
        <span className="cube-face cube-front" /><span className="cube-face cube-back" /><span className="cube-face cube-right" /><span className="cube-face cube-left" /><span className="cube-face cube-top" /><span className="cube-face cube-bottom" />
      </div>
      <div className="cube cube-small cube-small-one">
        <span className="cube-face cube-front" /><span className="cube-face cube-back" /><span className="cube-face cube-right" /><span className="cube-face cube-left" /><span className="cube-face cube-top" /><span className="cube-face cube-bottom" />
      </div>
      <div className="cube cube-small cube-small-two">
        <span className="cube-face cube-front" /><span className="cube-face cube-back" /><span className="cube-face cube-right" /><span className="cube-face cube-left" /><span className="cube-face cube-top" /><span className="cube-face cube-bottom" />
      </div>
    </div>
    <div className="cube-shadow" />
  </div>;
}
