import { useEffect, useState } from 'react';
import ReportPost from '../components/ReportPost';
import useApi from '../hooks/useApi';
import { FeedPost, v1 } from '../types';

function Reports() {
  const [reportsRes, reportsFetch] = useApi(v1.routes.reportedWalls);
  const [reportedWalls, setReportedWalls] = useState<FeedPost[]>([]);
  useEffect(() => {
    reportsFetch();
  }, []);

  useEffect(() => {
    if (reportsRes?.status !== 200) return;

    const handleReportsRes = async () => {
      if (reportsRes) {
        setReportedWalls(await reportsRes.json());
      }
    };

    handleReportsRes();
  }, [reportsRes]);

  return (
    <div>
      <h1>Reports</h1>
      {reportedWalls?.map((wall) => (
        <ReportPost
          key={wall.wallID}
          preview={wall.preview}
          wallID={wall.wallID}
          ownerID={wall.ownerID}
          ownerUsername={wall.wallID.toString(10)}
          edits={wall.edits}
          lastEdit={wall.lastEdit}
          likes={wall.likes}
          liked={wall.liked}
        />
      ))}
    </div>
  );
}

export default Reports;
