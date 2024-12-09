const ErrorCallContract = (error) => {
    if (error.message.toString().includes("Internal JSON-RPC error.")) {
        try {
            let json = JSON.parse(error.message.toString().replace("Internal JSON-RPC error.\n", ""));
            console.error(json.data.reason);
        } catch (e) {
            console.error(error.message);
        }
    } else {
        console.error(error.message);
    }
};

export default ErrorCallContract;