import { PostsProvider } from "../contexts/postsContext";
import DashboardContainer from "../containers/DashboardContainer.jsx";

const DashboardPage = () => {
  return (
    <PostsProvider>
      <DashboardContainer />
    </PostsProvider>
  );
};

export default DashboardPage;
