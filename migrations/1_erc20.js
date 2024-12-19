const ERC20 = artifacts.require("ERC20");

module.exports = (deployer) => {
    deployer.deploy(ERC20);
};