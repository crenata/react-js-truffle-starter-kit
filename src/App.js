import React, {PureComponent} from "react";
import AppRoutes from "./AppRoutes";
import Web3 from "web3";
import TruffleContract from "@truffle/contract";
import Web3Context from "./contexts/Web3Context";
import Currency from "./helpers/Currency";
import IsEmpty from "./helpers/IsEmpty";
import ErrorNotDeployed from "./helpers/errors/ErrorNotDeployed";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";

class App extends PureComponent {
    constructor(props) {
        super(props);
        this.initialState = {
            loading: true,
            web3: null,
            block: 0,
            chainId: 0,
            newBlockHeadersSubscription: null,
            account: "",
            primaryBalance: 0,
            token: null,
            tokenSupply: 0,
            symbol: "",
            decimals: 0,
            balance: 0,
            isLoadingAddToken: false,
            loadWeb3: () => false,
            getPrimaryBalance: () => false
        };
        this.state = {
            ...this.initialState
        };
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.getPrimaryBalance = this.getPrimaryBalance.bind(this);
        this.addToken = this.addToken.bind(this);
    }

    componentDidMount() {
        this.setState({
            loadWeb3: this.loadWeb3,
            getPrimaryBalance: this.getPrimaryBalance,
            addToken: this.addToken
        }, () => {
            this.loadWeb3();
        });
    }

    setLoading(value, callback) {
        this.setState({
            loading: value
        }, () => {
            if (!IsEmpty(callback) && typeof callback === "function") callback();
        });
    }

    loadWeb3() {
        this.setLoading(true, () => {
            let web3 = null;
            if (!IsEmpty(window.ethereum)) {
                web3 = new Web3(window.ethereum);
                this.setState({
                    web3: web3
                }, () => {
                    this.getBlockNumber();
                    this.networkWatcher(() => {
                        window.ethereum.request({
                            method: "eth_requestAccounts"
                        }).then((accounts) => {
                            this.initAccounts(accounts);
                        }).catch((error) => {
                            this.errorGettingAccounts();
                        }).finally(() => {});
                    });
                });
            } else if (!IsEmpty(window.web3)) {
                web3 = new Web3(window.web3.currentProvider);
                this.setState({
                    web3: web3
                }, () => {
                    this.getBlockNumber();
                    this.networkWatcher(() => {
                        window.ethereum.enable().then((accounts) => {
                            this.initAccounts(accounts);
                        }).catch((error) => {
                            this.errorGettingAccounts();
                        }).finally(() => {});
                    });
                });
            } else {
                window.alert("Non-EVM browser detected. You should consider tyring Metamask!");
            }
        });
    }

    getBlockNumber() {
        this.state.web3.eth.getBlockNumber().then(value => {
            this.setState({
                block: this.state.web3.utils.toNumber(value)
            });
        }).catch((error) => {
            console.error("Failed fetch block number.");
        }).finally(() => {});
    }

    networkWatcher(callback) {
        if (!IsEmpty(window.ethereum)) {
            window.ethereum.request({
                method: "eth_chainId"
            }).then((value) => {
                this.setState({
                    chainId: Number(value)
                }, () => {
                    if (this.state.chainId !== Number(process.env.REACT_APP_CHAIN_ID)) {
                        window.ethereum.request({
                            method: "wallet_switchEthereumChain",
                            params: [
                                {
                                    chainId: this.state.web3.utils.toHex(Number(process.env.REACT_APP_CHAIN_ID))
                                }
                            ]
                        }).then((value) => {
                            console.log("Automatic switch network.");
                            if (!IsEmpty(callback) && typeof callback === "function") callback();
                        }).catch((error) => {
                            console.error("Failed to automatic switch network, try automatic add network.");
                            window.ethereum.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: this.state.web3.utils.toHex(process.env.REACT_APP_CHAIN_ID),
                                        chainName: "Ethereum Mainnet",
                                        rpcUrls: [
                                            "https://mainnet.infura.io"
                                        ],
                                        iconUrls: [
                                            "https://etherscan.io/images/svg/brands/ethereum-original.svg"
                                        ],
                                        nativeCurrency: {
                                            name: "Ethereum",
                                            symbol: "ETH",
                                            decimals: 18
                                        },
                                        blockExplorerUrls: [
                                            "https://etherscan.io"
                                        ]
                                    }
                                ],
                            }).then((value) => {
                                console.log("Successfully add network.");
                                if (!IsEmpty(callback) && typeof callback === "function") callback();
                            }).catch((error) => {
                                console.error("Failed to add network.");
                            }).finally(() => {});
                        }).finally(() => {});
                    } else {
                        if (!IsEmpty(callback) && typeof callback === "function") callback();
                    }
                });
            }).catch((error) => {
                console.error("Failed fetch chain id.");
            }).finally(() => {});
        } else {
            console.error("Non-EVM browser detected. You should consider tyring Metamask!");
        }
    }

    initAccounts(accounts) {
        this.getAccounts(accounts);
        this.getListeners();
    }

    getAccounts(accounts) {
        if (!IsEmpty(accounts)) {
            this.setState({
                account: accounts[0]
            }, () => {
                this.getPrimaryBalance();
            });
        }
    }

    getPrimaryBalance() {
        if (!IsEmpty(this.state.account)) {
            this.state.web3.eth.getBalance(this.state.account).then((value) => {
                this.setState({
                    primaryBalance: this.state.web3.utils.fromWei(value, "ether")
                }, () => {
                    this.getBlockchainData();
                });
            }).catch((error) => {
                console.error(`Failed fetch ${Currency().symbol} balance.`);
            }).finally(() => {
                this.setLoading(false);
            });
        }
    }

    addToken() {
        if (!IsEmpty(window.ethereum)) {
            this.setState({
                isLoadingAddToken: true
            }, () => {
                window.ethereum.request({
                    method: "wallet_watchAsset",
                    params: {
                        type: "ERC20",
                        options: {
                            address: this.state.token?.address,
                            symbol: this.state.symbol,
                            decimals: this.state.decimals,
                            image: `${window.location.origin}/logo512.png`,
                        }
                    }
                }).then((value) => {
                    console.log("Added.");
                }).catch((error) => {
                    console.error("Failed add token to wallet.");
                }).finally(() => {
                    this.setState({
                        isLoadingAddToken: false
                    });
                });
            });
        } else {
            console.error("Non-EVM browser detected. You should consider tyring Metamask!");
        }
    }

    listenAccountChanges() {
        if (!IsEmpty(window.ethereum)) {
            window.ethereum.on("accountsChanged", (accounts) => {
                this.getAccounts(accounts);
            });
        }
    }

    listenChainChanges() {
        if (!IsEmpty(window.ethereum)) {
            window.ethereum.on("chainChanged", (chainId) => {
                this.getBlockchainData();
            });
        }
    }

    listenNewBlockHeaders() {
        if (!IsEmpty(this.state.web3)) {
            let newBlockHeadersSubscription = this.state.web3.eth.subscribe("newBlockHeaders", (error, blockHeader) => {
                if (IsEmpty(error)) {
                    this.getPrimaryBalance();
                } else {
                    console.error("Block Headers Subscription Error.", error);
                }
            }).on("connected", (subscriptionId) => {
                console.info("Block Headers Subscription Connected :", subscriptionId);
            }).on("data", (data) => {
                console.info("Block Headers Subscription Data :", data);
            }).on("error", (error) => {
                console.error("Block Headers Subscription Error :", error);
            });
            this.setState({
                newBlockHeadersSubscription: newBlockHeadersSubscription
            });
        }
    }

    errorGettingAccounts() {
        console.error("Not connected account.");
        this.setLoading(false);
    }

    getListeners() {
        this.listenAccountChanges();
        this.listenChainChanges();
        // this.listenNewBlockHeaders();
    }

    getBlockchainData() {
        this.loadToken();
    }

    loadToken() {
        if (!IsEmpty(this.state.web3)) {
            const token = TruffleContract(Token);
            token.setProvider(this.state.web3.currentProvider);
            token.deployed().then((data) => {
                this.setState({
                    token: data
                }, () => {
                    this.state.token.balanceOf(this.state.account).then((value) => {
                        this.setState({
                            balance: this.state.web3.utils.fromWei(value, "ether")
                        }, () => {
                            this.state.token.totalSupply().then((value) => {
                                this.setState({
                                    tokenSupply: this.state.web3.utils.fromWei(value, "ether")
                                }, () => {
                                    this.state.token.symbol().then((value) => {
                                        this.setState({
                                            symbol: value
                                        }, () => {
                                            this.state.token.decimals().then((value) => {
                                                this.setState({
                                                    decimals: this.state.web3.utils.toNumber(value)
                                                });
                                            }).catch((error) => {
                                                console.error("Failed fetch token decimals.");
                                            }).finally(() => {});
                                        });
                                    }).catch((error) => {
                                        console.error("Failed fetch token symbol.");
                                    }).finally(() => {});
                                });
                            }).catch((error) => {
                                console.error("Failed fetch token supply.");
                            }).finally(() => {});
                        });
                    }).catch((error) => {
                        console.error("Failed fetch token balance.");
                    }).finally(() => {});
                });
            }).catch((error) => {
                ErrorNotDeployed(token, error);
            }).finally(() => {});
        }
    }

    render() {
        return (
            <Web3Context.Provider value={this.state}>
                <AppRoutes />
            </Web3Context.Provider>
        );
    }
}

export default App;
