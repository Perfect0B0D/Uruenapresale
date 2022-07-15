import { ethers } from "./ethers-5.2.esm.min.js";
let isConnected = false;
let provider;
let signer;
const contractAddress = '0x0bafbaf73634c18af98b0eb4fd789535b0f360e5';
const abi = [{ "inputs": [{ "internalType": "address", "name": "_token", "type": "address" }, { "internalType": "address", "name": "ownerAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "URUENAOwnerAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "URUENAToken", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getThePrice", "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isWhiteListed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_tokenNum", "type": "uint256" }], "name": "purchase", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "ownerAddress", "type": "address" }], "name": "setURUENAOwnerAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "setWhiteList", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
document.getElementById("connectWalletBtn").onclick = async () => {

    if (isConnected) {
        isConnected = false;
        document.getElementById("connectWalletBtn").innerHTML = "Connect";

        document.getElementById('buyBtn').setAttribute('data-address', '');
    } else {
        const network = {
            name: "binance smart chain network",
            chainId: 56,
            ensAddress: null
        };
        provider = new ethers.providers.Web3Provider(window.ethereum, network)

        // MetaMask requires requesting permission to connect users accounts
        await provider.send("eth_requestAccounts", []);

        // The MetaMask plugin also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, you need the account signer...
        signer = provider.getSigner()

        const address = await signer.getAddress();

        isConnected = true;
        document.getElementById("connectWalletBtn").innerHTML = address.toString().slice(0, 10) + "...";

        document.getElementById('buyBtn').setAttribute('data-address', address);
    }

}

document.getElementById("buyBtn").onclick = async () => {
    let address = document.getElementById('buyBtn').getAttribute('data-address');
    if (address == "") {
        alert("Please connect wallet!")
    } else {
        let tokenAmount = document.getElementById("tokenAmount").value;
        if (tokenAmount == 0) {
            alert("Please enter token amount")
        } else {
            const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
            // const addr = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526" // test net, 0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE//,mainnet
            const addr = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";
            const priceFeed = new ethers.Contract(addr, aggregatorV3InterfaceABI, provider);

            let roundData = await priceFeed.latestRoundData()
                .then((roundData) => {
                    // Do something with roundData
                    console.log("Latest Round Data", parseInt(roundData.answer._hex, 16))
                    let bnbPrice = parseInt(roundData.answer._hex, 16);
                    let totalValue = parseInt(tokenAmount * 700000 * 10 ** 18 / bnbPrice);
                    // let totalValue = tokenAmount * 700000 * 10 ** 18 / bnbPrice;
                    console.log("totalValue ==> ", totalValue)
                    const erc20_rw = new ethers.Contract(contractAddress, abi, signer);
                    erc20_rw.purchase(tokenAmount, { value: totalValue.toString() }).then((tx) => {
                        tx.wait().then(() => {
                            alert("Purchase successed!");
                            document.getElementById("tokenAmount").value = 0;
                        });
                    });
                })
        }

    }
}
