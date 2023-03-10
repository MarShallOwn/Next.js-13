import React from 'react'

export default async function getUserPosts(userId: string) {

    // the revalidate is the ISR (Incremental static regeneration)
    // that means that the server side rendering happens normally and the stale data is the one that is being shown
    // but after 60 seconds next js will revalidate the data meaning that the stale data will be updated with the new ones after 60 seconds
    // but that doesn't mean that the page will update after each 60 seconds automatically but you ned to also leave the page and return to it
    // to see the new data because if the 60 seconds have passed and you still in the page you will still see the stale data but to see the new
    // data you will have to leave the page then return to the page
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`, { next : { revalidate: 60 } })

    if(!res.ok) return undefined
    return res.json();
}
