import bnb from "../images/bnb.png";
import eth from "../images/eth.png";

const Currency = () => {
    switch (process.env.REACT_APP_CURRENCY) {
        case "BNB":
            return {
                image: bnb,
                symbol: "BNB"
            };
        default:
            return {
                image: eth,
                symbol: "ETH"
            };
    }
};

export default Currency;