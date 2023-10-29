// Import the functions we need from the firebase SDKs.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, onValue, ref, remove, set } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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

// connect db collection ref. of firebase.
const transactionRef = ref(db, "transaction/");

// for unique identity of transection data-set.
let UUID = Math.floor(Math.random() * 100000),
    SID = 0;    // for the serial issue.

// select the DOM and assign them to a variable.
const transactionType = document.querySelector("#transactionType"),
    transactionTitle = document.querySelector("#transactionTitle"),
    transactionAmount = document.querySelector("#transactionAmount"),
    transactionFormBtn = document.querySelector("#addTransactionBtn");

const transactionBalance =document.querySelector("#transactionBalance span"),
    transactionIncome =document.querySelector("#transactionIncome span"),
    transactionExpense =document.querySelector("#transactionExpense span");

const transactionHistoryContainer = document.querySelector(".transactionHistoryTable tbody");

// create a html table row template.
const tableRowTemplate = (data, sid) => {
    const {uid, title, type, amount} = data;
    const styledCondition = type == "expense" ? `style="color: red"` : `style="color: blue"`;
    return `<tr id="${uid}">
        <td>${sid++}</td>
        <td id="TrTitle">${title}</td>
        <td id="TrType" ${styledCondition}>${type}</td>
        <td id="TrAmount" >${amount}</td>
        <td><span class="material-symbols-rounded" id="editTransaction" >edit_note</span></td>
        <td><span class="material-symbols-rounded" id="deleteTransaction">delete</span></td>
    </tr>`
};

// reset the html form field.
const formResetField = () => {
    transactionTitle.value = "";
    transactionAmount.value = "";
}

// declaretion of this function for the Displayed Financial Status in DOM.
const displayFinancialStatus = (transactionSnapshots) => {
    // segregate the specific data from all datas.
    const IncomeDataSet = Object?.values(transactionSnapshots)?.filter(({type}) => type == "income"),
        expenseDataSet = Object?.values(transactionSnapshots)?.filter(({type}) => type == "expense");
        
    // get the amount datas form segregated data set.
    const incomeAmtDataSet = IncomeDataSet.map(({amount}) => Number(amount)),
        expenseAmtDataSet = expenseDataSet.map(({amount}) => Number(amount));
        
    //  get the total amount form amount data set.
    const sumWithIncome = incomeAmtDataSet.reduce((accumulator, currentValue) => accumulator + currentValue, 0),
        sumWithExpense = expenseAmtDataSet.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        
    // display income, expense and balance in dom.
    transactionBalance.textContent = sumWithIncome - sumWithExpense;
    transactionIncome.textContent = sumWithIncome;
    transactionExpense.textContent = sumWithExpense;
}

// table to form updated data transaction.
const tableToFormDataPass = (nodeElement) => {
    // data pass to form filed.
    transactionTitle.value = nodeElement.querySelector("#TrTitle").textContent;
    transactionType.value = nodeElement.querySelector("#TrType").textContent;
    transactionAmount.value = nodeElement.querySelector("#TrAmount").textContent;
    
    // css customaization and update the add transaction button to update button.
    transactionFormBtn.setAttribute("id","updateTransactionBtn");
    transactionFormBtn.textContent = "Update Transaction";
}

// update the transaction when click on update button.
const updateTransactionEvent = (transactionId) =>{
    // event listener for update the transaction.
    transactionFormBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        await update((ref(db, "transaction/" + transactionId)),{
            uid: transactionId,
            title: transactionTitle.value,
            amount: transactionAmount.value,
            type: transactionType.value, 
        })
        alert("successfully, updated your transaction.");
        formResetField();
        id++;
    });
}

// update operation declaretion.
const updateTransaction = (thisElements) => {         
    thisElements.forEach(element => {
        let transactionId = element.parentNode.parentNode.id;
        element.addEventListener("click", (event) => {
            event.preventDefault();
            // select the root node and assign them a variable.
            const rootNode = element.parentNode.parentNode;
            // invoke for data passing.
            tableToFormDataPass(rootNode);
            // inboke for event fire.
            updateTransactionEvent(transactionId); 
        })
    })
}

// delete operation declaretion.
const deleteTransaction = (thisElements) => {
    // even listener for deleted transaction.
    thisElements.forEach(element => {
        const id = element.parentNode.parentNode.id;
        element.addEventListener("click", async (event) => {
            event.preventDefault();
            await remove(ref(db, "transaction/" + id));
            element.parentNode.parentNode.remove();
        })
    })
}

// read transaction history from firebase db.
onValue(transactionRef, (snapshot) => {
    SID = 1;
    const transactionSnapshots = snapshot.val() || [];
    // disple all the transaction in DOM.
     transactionHistoryContainer.innerHTML = Object?.values(transactionSnapshots)?.map((data) => 
        tableRowTemplate(data, SID++)
    ).join("");
    
    // DOM selection and assign that a variable.
    let editTransactionBtn = document.querySelectorAll("#editTransaction"),
        deleteTransactionBtn = document.querySelectorAll("#deleteTransaction");
        
    // invoke the edit operation.
    updateTransaction(editTransactionBtn);
    
    // invoke the delete operation.
    deleteTransaction(deleteTransactionBtn);
    
    // invoke the financial status.
    displayFinancialStatus(transactionSnapshots);
 });
 
// event listener for transaction type change.
transactionType.addEventListener("change", (event) => {
    event.preventDefault();
    return transactionType.value;
})

// event listener for transaction button is clicked and sand the data to db.
transactionFormBtn.addEventListener("click", (event) => {
    event.preventDefault();
    // write oparetion in firebase db.
    set(ref(db, "transaction/trUID-" + UUID),{
        uid: `trUID-${UUID}`,
        title: transactionTitle.value,
        amount: transactionAmount.value,
        type: transactionType.value, 
   });
   alert("successfully, added your transaction.");
   formResetField();
   UUID++;
});