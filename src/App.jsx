import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import Table from "./components/GenericTable/Table";
import { gqlUrl } from "../utils/constant";

const App = () => {
  const client = new ApolloClient({
    uri: gqlUrl,
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
        <Table query={GET_USERS} itemsPerPage={10} />
      </div>
    </ApolloProvider>
  );
};

export default App;
