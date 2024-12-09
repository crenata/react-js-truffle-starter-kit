import React, {PureComponent} from "react";
import PropTypes from 'prop-types';
import "./BgOuterSpace.css";

class BgOuterSpace extends PureComponent {
    render() {
        return (
            <div className={`position-relative overflow-hidden ${this.props.className}`}>
                <div className="stars"></div>
                <div className="twinkling"></div>
                <div className="clouds"></div>
                {this.props.children}
            </div>
        );
    }
}

BgOuterSpace.propTypes = {
    className: PropTypes.string
};

export default BgOuterSpace;