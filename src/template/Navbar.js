import React, {PureComponent} from "react";
import {Link} from "react-router-dom";
import Identicon from "identicon.js";
import Config from "../configs/Config";
import Web3Context from "../contexts/Web3Context";
import logo from "../images/logo.png";
import IsEmpty from "../helpers/IsEmpty";
import TextNeon from "../helpers/texts/TextNeon";
import TextGlow from "../helpers/texts/TextGlow";
import "./Navbar.css";

class Navbar extends PureComponent {
    scrollSmooth(selector) {
        document.querySelector(selector)?.scrollIntoView({
            behavior: "smooth"
        });
    }

    render() {
        return (
            <nav className="navbar navbar-light navbar-expand-lg z-4">
                <div className="container h-100">
                    <Link to={Config.Links.Home} className="navbar-brand text-white d-flex align-items-center">
                        <img
                            src={logo}
                            alt="Brand"
                            width="36"
                            height="36"
                        />&nbsp;&nbsp;
                        <TextNeon className="m-0 fw-bold fs-4" size={5}>React App</TextNeon>
                    </Link>
                    <button
                        className="navbar-toggler"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbar-react-app"
                        aria-controls="navbar-react-app"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse p-3 p-md-0" id="navbar-react-app">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="nav-link text-white" onClick={event => this.scrollSmooth("#menu-abc")}>Menu Abc</button>
                            </li>
                        </ul>
                        <div className="ms-auto mt-1 mt-md-0">
                            {IsEmpty(this.context.account) ?
                                <button className="btn text-white bgc-FFA500 btn-bubble" onClick={this.context.loadWeb3}>Connect Wallet</button> :
                                <div className="account d-flex align-items-center">
                                    <TextGlow className="m-0 small" size={1}>{this.context.account}</TextGlow>
                                    <img
                                        src={`data:image/png;base64, ${new Identicon(this.context.account, 24).toString()}`}
                                        alt="Account"
                                        width="24"
                                        height="24"
                                        className="rounded-circle ms-2 logo"
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

Navbar.contextType = Web3Context;

export default Navbar;