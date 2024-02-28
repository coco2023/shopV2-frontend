import IntercomChat from "../intercom/IntercomChat";

const HelpPage = () => {
  const currentUser = {
    name: "John Doe",
    id: "uuid-for-john",
    email: "john@example.com",
    createdAt: Math.floor(Date.now() / 1000), // Example timestamp
  };

  return (
    <div>
      <h1>Help Page</h1>
      <IntercomChat/>
    </div>
  );
};

export default HelpPage;