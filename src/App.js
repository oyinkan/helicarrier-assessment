import { useEffect, useState } from 'react';
import axios from 'axios';
import DynamicFilter from './components/Filter';
import Search from './components/Search';

const typeFilter = [
  {
    id: 'Credit',
    name: 'Credit'    
  },
  {
    id: 'Debit',
    name: 'Debit'    
  }
];

const statusFilter = [
  {
    id: 'Successful',
    name: 'Sucessful'
  },
  {
    id: 'Failed',
    name: 'Failed'
  }
]

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const queryData = {
      "query": `query {allTransactions { id amount createdon narrative transactionref type status }}`
    }

    const getAllTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/graphql', queryData)
        setData(response.data.data.allTransactions);
        setLoading(false);

        let groupFilteredData = transformResult(response.data.data.allTransactions);
        setFilteredData(groupFilteredData);
      } catch (error) {
        console.log(error);
      }
    }
    getAllTransactions()
  }, [])

  /* transform response from the API to show based on date */
  const transformResult = (data) => {
    let filtered = [];

    data.forEach(item => {
      const date = item.createdon.split('T')[0];

      if (!filtered[date]) {
        filtered[date] = [item];
      } else {
        filtered[date].push(item);
      }
    })

    const groupFilteredData = Object.keys(filtered).map((date) => {
      return {
        date,
        transactions: filtered[date]
      };
    });

    return groupFilteredData;
  }

  /* handle select dropdown change */
  const handleSelectChange = (type) => {
    if (type !== "") {
      const filteredDataByTypeOrStatus = data.filter(newVal => {
        if (type === "Credit" || type === "Debit") {
          return newVal.type === type; 
        } else {
          return newVal.status === type;
        }
      });

      const groupFilteredData = transformResult(filteredDataByTypeOrStatus);
      setFilteredData(groupFilteredData);
    }
  }

  return (
    <>
      <h1>Transaction Data</h1>
      <Search
        searchValue={searchValue}
        handleSearchValue={e => setSearchValue(e.target.value)}
      />
      <div>
        <DynamicFilter
          optionsData={typeFilter}
          onSelectChange={handleSelectChange}
        />
        <DynamicFilter
          optionsData={statusFilter}
          onSelectChange={handleSelectChange}
        />
      </div>
      { loading 
        ? <p>Loading...</p> 
        : ( filteredData.map((item, index) => (
            <div key={index} className="mb-4">
              <h4 className="mb-4">{item.date}</h4>
              {
                item.transactions.filter(datum => {
                  if (searchValue === '') {
                    return datum;
                  } else if (datum.narrative.toLowerCase().includes(searchValue.toLowerCase())) {
                    return datum;
                  }
                }).map(datum => (
                  <div className="flex card" key={datum.id}>
                    <div>
                      <div
                        className={`card-avatar ${datum.type === "Credit" ? "credit" : "debit"}`}
                      >
                        {datum.type === "Credit" ? "C" : "D"}
                      </div>
                    </div>
                    <div>
                      <h5>{datum.narrative}</h5>
                      <p>{datum.type}</p>
                      <p className={`status ${datum.status === "Successful" ? 'status-success' : "status-failure"}`}>{datum.status}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          )
      ))}
    </>
  );
}

export default App;
