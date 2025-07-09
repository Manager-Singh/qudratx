import { useParams } from "react-router-dom";

const Activity = () => {
  const { id, activityId } = useParams();

  return (
    <div className="container">
    <div className="row">
      <h1>Selected Parent ID: {id}</h1>
      <h2>Selected Authority ID: {activityId}</h2>
    </div>
    </div>
  );
};

export default Activity;
