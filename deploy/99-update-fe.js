const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADD_FILE = "../next-lottery/constants/contractAddress.json"
const FRONT_END_ABI_FILE = "../next-lottery/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("updating frontend ....")
       await updateContractAddress()
        await updateAbi()
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(FRONT_END_ABI_FILE, raffle.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddress() {
    const raffle = await ethers.getContract("Raffle")
    const contractAddresses =await JSON.parse(fs.readFileSync(FRONT_END_ADD_FILE, "utf8"))
    const chainId = network.config.chainId.toString()
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId].includes(raffle.address)) {
            contractAddresses[chainId].push(raffle.address)
        }
    } else {
        contractAddresses[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONT_END_ADD_FILE, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
