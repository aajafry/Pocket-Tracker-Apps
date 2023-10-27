// Import the functions we need from the firebase SDKs.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, onValue, ref, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Firebase configuration credential.
const firebaseConfig = {
    apiKey: "AIzaSyAEwbYZUyKeHKyp3m9EVK224OHBxiiDPFA",
    authDomain: "expense-tracker-applicalion.firebaseapp.com",
    databaseURL: "https://expense-tracker-applicalion-default-rtdb.firebaseio.com",
    projectId: "expense-tracker-applicalion",
    storageBucket: "expense-tracker-applicalion.appspot.com",
    messagingSenderId: "76625274540",
    appId: "1:76625274540:web:f26a17d857535c85ede109"
 };
 
// Initialize Firebase.
const app = initializeApp(firebaseConfig);

//connect to db of firebase.
const db = getDatabase(app);

// for unique identity of transection data-set.
let UUID = Math.floor(Math.random() * 100000);
let SID = 0;    // for the serial issue. 

// select the DOM and assign them to a variable.
const transactionType = document.querySelector("#transactionType");
const transactionTitle = document.querySelector("#transactionTitle");
const transactionAmount = document.querySelector("#transactionAmount");
const transactionBtn = document.querySelector("#transactionBtn");

const transactionBalance =document.querySelector("#transactionBalance span");
const transactionIncome =document.querySelector("#transactionIncome span");
const transactionExpense =document.querySelector("#transactionExpense span");

const transactionHistoryContainer = document.querySelector(".transactionHistoryTable tbody");

let allData = [];

// event listener for transaction type change.
const changeEvents = async (thisElement) => {
    return await thisElement.value;
}

// event listener for transaction button is clicked and sand the data to db.
transactionBtn.addEventListener("click", (event) => {
    event.preventDefault();
    // write oparetion in firebase db.
    set(ref(db, "transaction/" + `transaction-${UUID}`),{
        uid: `transaction-${UUID}`,
        title: transactionTitle.value,
        amount: transactionAmount.value,
        type: transactionType.value, 
   });
   alert("successfully, added your transaction.");
   transactionTitle.value = "";
   transactionAmount.value = "";
   
})

 // read transaction history from firebase db.
 const transactionRef = ref(db, "transaction/");
 onValue(transactionRef, (snapshot) => {
    const transactionSnapshots = snapshot.val() || [];
    allData.push(transactionSnapshots);
    SID = 1;
    // disple all the transaction.
    Object?.values(transactionSnapshots)?.map(data => {
        const styledCondition = data.type == "expense" ? `style="color: red"` : `style="color: blue"`;
        const template = `<tr id="${data.uid}">
            <td>${SID++}</td>
            <td>${data.title}</td>
            <td ${styledCondition}>${data.type}</td>
            <td>${data.amount}</td>
            <td><span class="material-symbols-rounded" id="editTransaction" onclick="${editTransaction(this)}">edit_note</span></td>
            <td><span class="material-symbols-rounded" id="deleteTransaction" onclick="${removedTransaction(this)}">delete</span></td>
        </tr>`;
        transactionHistoryContainer.innerHTML += template;
    });
    // segregate the specific data from all datas.
    const IncomeDataSet = Object?.values(transactionSnapshots)?.filter(({type}) => type == "income");
    const expenseDataSet = Object?.values(transactionSnapshots)?.filter(({type}) => type == "expense");
    // get the amount datas form segregated data set.
    const incomeAmtDataSet = IncomeDataSet.map(({amount}) => Number(amount));
    const expenseAmtDataSet = expenseDataSet.map(({amount}) => Number(amount));
    //  get the total amount form amount data set.
    const sumWithIncome = incomeAmtDataSet.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const sumWithExpense = expenseAmtDataSet.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    // display income, expense and balance in dom.
    transactionBalance.textContent = sumWithIncome - sumWithExpense;
    transactionIncome.textContent = sumWithIncome;
    transactionExpense.textContent = sumWithExpense;
 })
 

 console.log(allData)
 // even listener for edited transaction.
 function editTransaction(current){
    // write edited operation.
    console.log("edit button fire!");
 }
 // even listener for removed transaction.
 function removedTransaction(current){
    // write removed operation.
    console.log("delete button fire!");
 }