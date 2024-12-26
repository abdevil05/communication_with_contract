const contractAddress = "0x1Dd5bE88733Fb38bA0DF277CeD962929665af93d"; // Deploy and replace with your contract address
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "retrieve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "num",
                "type": "uint256"
            }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let provider;
let signer;
let contract;

async function initContract() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === "undefined") {
            throw new Error("Please install MetaMask!");
        }

        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Create a provider
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        
        // Create contract instance
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Get and display contract name
        const name = await contract.name();
        document.getElementById("contractName").textContent = name;

        updateStatus("Connected to contract!", "success");
    } catch (error) {
        updateStatus("Error: " + error.message, "error");
    }
}

async function storeNumber() {
    try {
        const number = document.getElementById("storeNumber").value;
        if (!number) throw new Error("Please enter a number!");

        const tx = await contract.store(number);
        updateStatus("Transaction sent! Waiting for confirmation...", "pending");
        
        await tx.wait();
        updateStatus("Number stored successfully!", "success");
    } catch (error) {
        updateStatus("Error: " + error.message, "error");
    }
}

async function retrieveNumber() {
    try {
        const number = await contract.retrieve();
        document.getElementById("retrievedNumber").textContent = number.toString();
        updateStatus("Number retrieved successfully!", "success");
    } catch (error) {
        updateStatus("Error: " + error.message, "error");
    }
}

function updateStatus(message, type) {
    const status = document.getElementById("status");
    status.textContent = message;
    status.className = type;
}

// Initialize the contract when the page loads
window.addEventListener("load", initContract);

