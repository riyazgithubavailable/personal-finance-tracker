import React, { useState } from "react";
import { Radio, Select, Table } from "antd";
import searchImg from "../../asset/search.svg"
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
const { Option } = Select;

const TransactionsTable = ({transactions,addTransaction , fetchTransactions}) =>{
    //below table from antd
    const[search, setSearch] = useState("");
    const[typeFilter,setTypeFilter] = useState("");
    const[sortKey,setSortKey] = useState("");
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },
      ];
      let filterTransaction = transactions.filter((item)=>
      item.name.toLowerCase().includes(search.toLowerCase()) && 
      item.type.includes(typeFilter)
      )
      const sortedTransactions = [...filterTransaction].sort((a, b) => {
        if (sortKey === "date") {
          return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
          return a.amount - b.amount;
        } else {
          return 0;
        }
      });

      function exportCSV(){
        //for convert Json to csv
        var csv = unparse({
          //creating csv and passing column name
          fields: ["name", "type","date","amount"],
          //passing data i.e transactions array;
          data:transactions,
        });
        //for downloading any file in web devlopment you need to create blob
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
         document.body.removeChild(link);
      }

      function importFromCsv(event) {
        //convert csv to Json
        event.preventDefault();
        try {
          //we have lots of file but we need 0th file
          parse(event.target.files[0], {
            header: true,
            complete: async function (results) {
              // Now results.data is an array of objects representing your CSV rows
              //inwhich all data is present
              for (const transaction of results.data) {
                // Write each transaction to Firebase, you can use the addTransaction function here
                console.log("Transactions", transaction);
                const newTransaction = {
                  ...transaction,
                  //amt present in string so convert it to number
                  amount: parseFloat(transaction.amount),
                };
                await addTransaction(newTransaction, true);
              }
            },
          });
          toast.success("All Transactions Added");
          fetchTransactions();
          event.target.files = null;
        } catch (e) {
          toast.error(e.message);
        }
      }
    return(
      <div style={{ padding: "0rem 1rem" }}>
        
        <div
         className="row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
         <div className="input-flex">
         <img src={searchImg} width="16" />
         <input
         value={search}
         onChange={(e)=>setSearch(e.target.value)}
         placeholder="Search by name"
         />
         </div>
          <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
        </div>
        <div className="my-table">
        <div
        className="table-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
          className="table-buttons"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportCSV}>
              Export to CSV
            </button>
            <label for="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>
         <Table dataSource={sortedTransactions} columns={columns} />;
         </div>
         </div>
         
    )
}
export default TransactionsTable;