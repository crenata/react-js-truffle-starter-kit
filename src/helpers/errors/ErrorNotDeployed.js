import IsEmpty from "../IsEmpty";

const ErrorNotDeployed = (contract, error) => {
    if (IsEmpty(contract)) console.error("Not connected to blockchain.");
    else console.error(`${contract.contractName} contract is not deployed to this network.`);
};

export default ErrorNotDeployed;