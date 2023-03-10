import getAllUsers from '@/lib/getAllUsers';
import getUser from '@/lib/getUser';
import getUserPosts from '@/lib/getUserPosts';
import { Metadata } from 'next';
import React, { Suspense } from 'react'
import UserPosts from './components/UserPosts';

import { notFound } from "next/navigation";

type Params = {
    params: {
        userId: string
    }
}

// dynamic metadata
export async function generateMetadata({ params: { userId } }: Params) : Promise<Metadata> {
    // because we have the request below we aint gonna send another request but it will do one
    // request only and send that request result to both promises
    // it is like two requests in one request only
    const userData: Promise<User> = getUser(userId);
    const user: User = await userData;

    if(!user.name) {
        return {
            title: "User Not Found"
        }
    }

    return {
        title: user.name,
        description: `This is the page of ${user.name}`
    }
}

// ISR
//export const revalidate = 60 // revalidate after 60 seconds for everything inside the page not only for one request just like in the getUserPost 

// parallel fetching
export default async function UserPage({ params: { userId } }: Params) {

    const userData: Promise<User> = getUser(userId);
    const userPostsData: Promise<Post[]> = getUserPosts(userId);

    //const [user, userPosts] = await Promise.all([userData, userPostsData])

    const user = await userData;

    if(!user.name) return notFound()

    return (
        <>
            <h2>{user.name}</h2>
            <br />
            <Suspense fallback={<h2>Loading...</h2>}>
                {/* @ts-expect-error Server Component */}
                <UserPosts promise={userPostsData} />
            </Suspense>
        </>
    )
}

// this will convert the SSR (Server Side Rendering) to the recommended SSG (Static Site Generation)
// Next.js has no idea what value is being passed as a paramter in the UserPage Component that is why it is currently SSR
// but with generateStaticParams we will let Next.js in advanced know what those possible params be in the UserPage Component, so it will be converted to SSG at that time
// Next.js after receiving static params can now statically generate the pages in adavanced without Server Side Rendering (SSR) so now it is SSG not SSR
// and the SSG page will still follow our ISR (Incremental Static Regenertation) strategy and it will revalidate at the time interval that we added
export async function generateStaticParams() {
    // the request already is cached or stored previously from the users page so it will not be re-requested
    const usersData: Promise<User[]> = getAllUsers()

    const users = await usersData;

    return users.map(user => ({
        userId: user.id.toString() // to string because the id is number but the params always get the id as string because it is comming from the url that is why we converted it to string
    }))
}
