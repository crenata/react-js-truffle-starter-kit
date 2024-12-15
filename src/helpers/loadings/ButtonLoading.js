import React, {PureComponent} from "react";
import PropTypes from "prop-types";

class ButtonLoading extends PureComponent {
    render() {
        return (
            <button className={`btn btn-success ${this.props.className}`} disabled>
                <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                <span role="status" className="ms-2">Loading...</span>
            </button>
        );
    }
}

ButtonLoading.propTypes = {
    className: PropTypes.string
};

export default ButtonLoading;