import React, {PureComponent} from "react";
import Web3Context from "../contexts/Web3Context";
import logo from "../images/logo.png";
import metamask from "../images/metamask.png";
import "./Navbar.css";

class Footer extends PureComponent {
    addToken() {
        window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
                type: "ERC20",
                options: {
                    address: this.context.token?.address,
                    symbol: this.context.symbol,
                    decimals: this.context.decimals,
                    image: "../images/logo.png",
                }
            }
        }).then((value) => {
            console.success("Added.");
        }).catch((error) => {
            console.error("Failed add token to wallet.");
        }).finally(() => {});
    }

    render() {
        return (
            <footer className="container py-5 border-top z-3">
                <div className="row">
                    <div className="col-12 col-md-3">
                        <div className="d-flex align-items-center">
                            <img
                                src={logo}
                                alt="Brand"
                                width="64"
                            />
                            <p className="ms-3 mb-0 text-white">Maelyn</p>
                        </div>
                        <button
                            className="box-shadow-primary border rounded bg-transparent text-white x-small text-nowrap px-2 py-1 mt-3"
                            onClick={event => this.addToken()}
                        >
                            <img
                                src={metamask}
                                alt="Metamask"
                                width="16"
                                height="16"
                                className="me-2"
                            />
                            Add ${this.context.symbol} Token
                        </button>
                        <p className="mt-5 mb-0 text-white small">{new Date().getFullYear()} &copy; All Rights Reserved</p>
                    </div>
                </div>
            </footer>
        );
    }
}

Footer.contextType = Web3Context;

export default Footer;