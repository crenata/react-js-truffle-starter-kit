import React, {PureComponent} from "react";
import PropTypes from 'prop-types';
import {CSSTransition, TransitionGroup} from "react-transition-group";
import Web3Context from "../contexts/Web3Context";
import Loading from "../helpers/loadings/Loading";
import Navbar from "./Navbar";
import "./Template.css";
import Footer from "./Footer";
import BgOuterSpace from "../helpers/backgrounds/BgOuterSpace";

class Template extends PureComponent {
    render() {
        return (
            <TransitionGroup className={`app position-relative ${this.props.className}`}>
                <CSSTransition
                    key={this.context.loading}
                    timeout={1000}
                    classNames="fade-out"
                >
                    {this.context.loading ? <Loading /> : <BgOuterSpace className="app">
                        <Navbar />
                        <div className="position-absolute w-100 app-content z-3">
                            <div className="pb-5">
                                {this.props.children}
                            </div>
                            <Footer />
                        </div>
                    </BgOuterSpace>}
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

Template.contextType = Web3Context;
Template.propTypes = {
    className: PropTypes.string
};

export default Template;