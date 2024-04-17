import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import Table from "./components/GenericTable/Table";
import { MOCK_DATA_URL } from "../utils/constant";

const App = () => {
  const client = new ApolloClient({
    uri: MOCK_DATA_URL,
    cache: new InMemoryCache(),
  });

  const GET_USERS = gql`
    query Histories {
      histories {
        title
        details
        event_date_utc
      }
    }
  `;

  return (
    <ApolloProvider client={client}>
      <div>
        <Table query={GET_USERS} itemsPerPage={5} />
      </div>
    </ApolloProvider>
  );
};

export default App;
