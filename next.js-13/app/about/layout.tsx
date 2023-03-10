import React from 'react'
import classes from "./page.module.css"

export default function AboutLayout({ children } : { children : React.ReactNode }) {
    return(
    <>
    <nav>About Navbar</nav>
        <main className={classes.main}>
            {children}
        </main>
    </>
  )
}
