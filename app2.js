let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer



// import cards from './data.js'
const cards = [
    { id: 1, image: './images/9.jpg' , title: "John", address : '0xE35Fa238d473a7B71cD0de29DEa89eD24AEF0568',content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde assumenda optio quo." },
    { id: 2, image: './images/14.jpg' , title: "Jack", address : '0xE35Fa238d473a7B71cD0de29DEa89eD24AEF0568', content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde assumenda optio quo." },
    { id: 3, image: './images/51.jpg' , title: "Alice",address : '0xE35Fa238d473a7B71cD0de29DEa89eD24AEF0568', content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde assumenda optio quo." },
    { id: 4, image: './images/53.jpg' , title: "Bob", address : '0xE35Fa238d473a7B71cD0de29DEa89eD24AEF0568',content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde assumenda optio quo." },
    { id: 5, image: './images/54.jpg' , title: "Sally ", address : '0xE35Fa238d473a7B71cD0de29DEa89eD24AEF0568', content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde assumenda optio quo." },
    { id: 6, image: './images/55.jpg' , title: "Abraham", address : '0xE35Fa238d473a7B71cD0de29DEa89eD24AEF0568',content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde assumenda optio quo." },
    { id: 7, image: './images/82.jpg' , title: "Adam", address : '0xE35Fa238d473a7B71cD0de29DEa89eD24AEF0568',content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde assumenda optio quo." },
    { id: 8, image: './images/9.jpg' , title: "Garry", address : '0xE35Fa238d473a7B71cD0de29DEa89eD24AEF0568',content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Unde assumenda optio quo." },
];


function createCard(id, title, content , address , imageUrl) {
    const card = document.createElement("div");
    card.className = "card";
    const imageElement = imageUrl ? `<img src="${imageUrl}" alt="Card Image" />` : '';

    card.innerHTML = `
    <h2>${title}</h2>
    ${imageElement}
    <p>${address}</p>
    <p>${content}</p>
    <button onclick="connectMetamask()">Connect</button>
    <button onclick="getBalance()">Get Balance</button>
    <button onclick="sendUsdtToAccount()">Donate Now!</button>
    
`;

    return card;
}
function openModal() {
    document.getElementById("myModal").style.display = "block";
}
function openModal2() {
    document.getElementById("myModal2").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}
function closeModal2() {
    document.getElementById("myModal2").style.display = "none";
}


const cardContainer = document.getElementById("cardContainer");
// cardContainer.append('hello world')

// Iterate over the cards and append them to the container
cards.forEach(card => {
    const cardElement = createCard(card.id, card.title, card.content , card.address , card.image);
    cardContainer.appendChild(cardElement);
});


// 1. Connect Metamask with Dapp
async function connectMetamask() {
    try {
        let accounts=[]
       signer = null
        // if (accounts.length !== 0) {
        //     signer = null
        // }

         accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log('accounts is ' + accounts)

        const selectedAccount = accounts[0];

        signer = provider.getSigner(selectedAccount);

        console.log("Connected to account:", selectedAccount);
    } catch (error) {
        console.error("Error connecting to MetaMask:", error);
    }
}
// 2. Get balance
async function getBalance() {
    const balance = await signer.getBalance()
    const convertToEth = 1e18;
    console.log("account's balance in ether:", balance.toString() / convertToEth);

    document.getElementById("balanceOutput").textContent = `Account's balance in ether: ${balance.toString() / convertToEth}`;
    openModal();
}

// 3. read data from the USDT contract on kovan 
// const usdtAddress = "0x13512979ADE267AB5100878E2e0f485B568328a4";
const usdtAddress = "0xE35Fa238d473a7B71cD0de29DEa89eD24AEF0568";


const usdtAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint amount)"
];

async function readDataFromSmartContract() {

    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
    
    const name = await usdtContract.name()
    const symbol = await usdtContract.symbol()
    const decimals = await usdtContract.decimals()
    const totalSupply = await usdtContract.totalSupply()
    const myBalance = await usdtContract.balanceOf("0x06214f2E1e1896739D92F3526Bd496DC028Bd7F9")

    console.log(`name = ${name}`)
    console.log(`symbol = ${symbol}`)
    console.log(`decimals = ${decimals}`)
    console.log(`totalSupply = ${totalSupply / 1e6 }`)
    console.log(`myBalance = ${myBalance / 1e6}`)
}

// 4. Send Usdt to one account to another
async function sendUsdtToAccount() {
    try {
        const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
        await usdtContract.connect(signer).transfer("0x6CC3dFBec068b7fccfE06d4CD729888997BdA6eb", "500000000");

        // If the transfer is successful, open the modal
        document.getElementById("modalMessage").textContent='Transaction Success'
        openModal2();
        // openModal("Transaction Success", "USDT sent successfully!");
    } catch (error) {
        // Handle errors, you might want to show an error modal or log the error
        console.error("Transaction failed:", error.message);
    }
}

// 6. Call function on smart contract and wait for it to finish (to be mined)

// 7. Emit event and Print out the event immediately after being emmited
async function emitAnEvent() {
    const numberContractAddress = "0xf1f3298bc741a5801ac08f2be84f822de2312c97";

    const numberContractAbi = [
        "function emitAnEvent() external",
    ];

    const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    const tx = await numberContract.connect(signer).emitAnEvent()
    const txReceipt = await tx.wait()

    console.log("event was emmited")

    console.log(txReceipt.events[0])
}

// 8. Listen for events being emmited in the background
// listening for an event to be emitted, and to do a task based on that.



