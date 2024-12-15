import React, {PureComponent} from "react";
import Web3Context from "../contexts/Web3Context";
import logo from "../images/logo.png";
import metamask from "../images/metamask.png";

class Footer extends PureComponent {
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
                            <p className="ms-3 mb-0 text-white">React App</p>
                        </div>
                        {this.context.isLoadingAddToken ?
                            <button className="box-shadow-primary border rounded bg-transparent text-white x-small text-nowrap px-2 py-1 mt-3" disabled>
                                <span className="spinner-border spinner-border-xs" aria-hidden="true" />
                                <span role="status" className="ms-2">Loading...</span>
                            </button> :
                            <button
                                className="box-shadow-primary border rounded bg-transparent text-white x-small text-nowrap px-2 py-1 mt-3"
                                onClick={this.context.addToken}
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
                        }
                        <p className="mt-5 mb-0 text-white small">{new Date().getFullYear()} &copy; All Rights Reserved</p>
                    </div>
                </div>
            </footer>
        );
    }
}

Footer.contextType = Web3Context;

export default Footer;