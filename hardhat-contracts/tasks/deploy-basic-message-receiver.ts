import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl, getRouterConfig } from "./utils";
import { Wallet, providers } from "ethers";
import { BasicMessageReceiver__factory, BasicMessageReceiver } from "../typechain-types";
import { Spinner } from "../utils/spinner";

task(`deploy-basic-message-receiver`, `Deploys the BasicMessageReceiver smart contract`)
    .addOptionalParam(`router`, `The address of the Router contract`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const routerAddress = taskArguments.router ? taskArguments.router : getRouterConfig(hre.network.name).address;

        const privateKey = getPrivateKey();
        const rpcProviderUrl = getProviderRpcUrl(hre.network.name);

        const provider = new providers.JsonRpcProvider(rpcProviderUrl);
        const wallet = new Wallet(privateKey);
        const deployer = wallet.connect(provider);

        const spinner: Spinner = new Spinner();

        console.log(`ℹ️  Attempting to deploy BasicMessageReceiver on the ${hre.network.name} blockchain using ${deployer.address} address, with the Router address ${routerAddress} provided as constructor argument`);
        spinner.start();

        const basicMessageReceiverFactory: BasicMessageReceiver__factory = await hre.ethers.getContractFactory('BasicMessageReceiver') as BasicMessageReceiver__factory;
        const basicMessageReceiver: BasicMessageReceiver = await basicMessageReceiverFactory.deploy(routerAddress);
        await basicMessageReceiver.deployed();

        spinner.stop();
        console.log(`✅ Basic Message Receiver deployed at address ${basicMessageReceiver.address} on ${hre.network.name} blockchain`)
    });