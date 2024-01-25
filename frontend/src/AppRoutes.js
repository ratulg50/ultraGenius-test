import React from "react"
import { Navigate, useRoutes } from "react-router-dom"
import Home from "./components/Home"
import Login from "./components/Login"

const AppRoutes = () => {
  const token = localStorage.getItem("token")
  const getHomeRoute = () => {
    if (token) {
      return "/home"
    } else {
      return "/login"
    }
  }

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: "login",
      element: token ? <Navigate replace to='/home' /> : <Login />,
    },
    {
      path: "home",
      element: token ? <Home /> : <Navigate replace to='/login' />,
    },
  ])

  return routes
}

export default AppRoutes
