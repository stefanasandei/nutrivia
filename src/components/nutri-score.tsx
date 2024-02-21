/* eslint-disable @next/next/no-img-element */
import "@/styles/nutri-score.css";

export default function NutriScore({ score }: { score: string }) {
  //   <div className="nutri-container">
  //     <div className="title">NUTRI-SCORE</div>
  //     <div className="scores-container">
  //       <div className="scores">
  //         <span className="a">A</span>
  //         <span className="b">B</span>
  //         <span className="c">C</span>
  //         <span className="d">D</span>
  //         <span className="e">E</span>
  //       </div>
  //       <div className={"score " + score.toLocaleLowerCase()}>{score}</div>
  //     </div>
  //   </div>

  return (
    <img
      className="max-w-48"
      alt={`Nutri-Score of ${score}`}
      src={`https://static.openfoodfacts.org/images/attributes/dist/nutriscore-${score.toLocaleLowerCase()}.svg`}
    />
  );
}
