import React from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

const RouteElement = ({component: RouteComponent, ...props}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <RouteComponent {...props} location={location} navigate={navigate} params={params} />;
};

export default RouteElement;