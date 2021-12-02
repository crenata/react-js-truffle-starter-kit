import React, {PureComponent} from "react";
import AppRoutes from "./AppRoutes";
import Web3 from "web3";
import TruffleContract from "@truffle/contract";
import Web3Context from "./contexts/Web3Context";
import IsEmpty from "./helpers/IsEmpty";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min";

class App extends PureComponent {
    constructor(props) {
        super(props);
        this.initialState = {
            loading: true,
            web3: null,
            account: "",
            primaryBalance: 0,
            loadWeb3: () => false
        };
        this.state = {
            ...this.initialState
        };
        this.loadWeb3 = this.loadWeb3.bind(this);
    }

    componentDidMount() {
        this.setState({
            loadWeb3: this.loadWeb3
        }, () => this.loadWeb3());
    }

    loadWeb3() {
        this.setLoading(true, () => {
            let web3 = null;
            if (!IsEmpty(window.ethereum)) {
                web3 = new Web3(window.ethereum);
                this.setState({
                    web3: web3
                }, () => {
                    window.ethereum.request({method: "eth_requestAccounts"}).then((accounts) => {
                        this.getAccounts(accounts);
                        this.listenAccountChanges();
                        this.listenChainChanges();
                    }).catch((error) => {
                        this.errorGettingAccounts();
                    }).finally(() => {});
                });
            } else if (!IsEmpty(window.web3)) {
                web3 = new Web3(window.web3.currentProvider);
                this.setState({
                    web3: web3
                }, () => {
                    if (!IsEmpty(window.ethereum)) {
                        window.ethereum.enable().then((accounts) => {
                            this.getAccounts(accounts);
                        }).catch((error) => {
                            this.errorGettingAccounts();
                        }).finally(() => {});
                    }
                });
            } else {
                window.alert("Non-Ethereum browser detected. You should consider tyring Metamask!");
            }
        });
    }

    getAccounts(accounts) {
        if (!IsEmpty(accounts)) {
            this.setState({
                account: accounts[0]
            }, () => {
                this.state.web3.eth.getBalance(this.state.account).then((balance) => {
                    this.setState({
                        primaryBalance: balance
                    }, () => {
                        this.getBlockchainData();
                    });
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {
                    this.setLoading(false);
                });
            });
        } else {
            this.setState({
                ...this.initialState
            });
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

    errorGettingAccounts() {
        console.error("Error getting account.");
        this.setLoading(false);
    }

    getBlockchainData() {
        // this.loadBEP20Token();
    }

    setLoading(value, callback) {
        this.setState({
            loading: value
        }, () => {
            if (!IsEmpty(callback) && typeof callback === "function") callback();
        });
    }

    loadBEP20Token() {
        const token = TruffleContract(BEP20Token);
        token.setProvider(this.state.web3.currentProvider);
        this.setState({
            bep20Token: token
        }, () => {
            this.state.bep20Token.deployed().then((data) => {
                data.balanceOf(this.state.account).then((result) => {
                    this.setState({
                        bep20Balance: result
                    });
                }).catch((error) => {
                    console.error(error);
                }).finally(() => {});
            }).catch((error) => {
                console.error(error);
            }).finally(() => {});
        });
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