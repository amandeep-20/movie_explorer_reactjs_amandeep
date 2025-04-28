import React, { Component, ComponentType } from "react";
import { useNavigate } from "react-router-dom";

const WithNavigation = (Component: ComponentType<any>) => {
  const newComponent = (props: any) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
  return newComponent;
};

export default WithNavigation;