import { Outlet } from "react-router-dom"
import RequireAuth from "./RequireAuth"

export const Layout = () => {
  return (
    <RequireAuth>
      <Outlet/>
    </RequireAuth>
  )
}
 